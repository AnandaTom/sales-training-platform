"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import { ChatHeader } from "./chat-header";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { ChatInput } from "./chat-input";
import type { BuyerPersona, Scenario } from "@/lib/types";

interface ChatInterfaceProps {
  sessionId: string;
  persona: BuyerPersona;
  scenario: Scenario;
}

function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("");
}

export function ChatInterface({ sessionId, persona, scenario }: ChatInterfaceProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isEnding, setIsEnding] = useState(false);
  const [input, setInput] = useState("");
  const hasInitialized = useRef(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        personaId: persona.id,
        scenarioId: scenario.id,
      },
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Trigger the buyer's opening message
  useEffect(() => {
    if (!hasInitialized.current && messages.length === 0) {
      hasInitialized.current = true;
      sendMessage({
        text: "[Le vendeur decroche le telephone et attend que l'acheteur parle en premier]",
      });
    }
  }, [sendMessage, messages.length]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function handleEndSession() {
    setIsEnding(true);

    const conversationMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: getMessageText(m),
        timestamp: new Date().toISOString(),
      }));

    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "end",
        sessionId,
        messages: conversationMessages,
      }),
    });

    router.push(`/debrief/${sessionId}`);
  }

  function onSubmitMessage() {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }

  // Filter out the initial trigger message from display
  const displayMessages = messages.filter(
    (m, i) => !(i === 0 && m.role === "user" && getMessageText(m).startsWith("["))
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader
        personaName={persona.name}
        personaTitle={persona.title}
        personaAvatar={persona.avatar}
        personaDifficulty={persona.difficulty}
        scenarioStage={scenario.stage}
        onEndSession={handleEndSession}
        isEnding={isEnding}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4">
        <div className="mx-4 p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm">
          <p className="font-medium text-primary">Contexte du scenario</p>
          <p className="text-muted-foreground mt-1">{scenario.description}</p>
          <p className="text-muted-foreground mt-1">
            <strong>Produit :</strong> {scenario.productContext}
          </p>
        </div>

        {displayMessages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role as "user" | "assistant"}
            content={getMessageText(message)}
            personaAvatar={persona.avatar}
            personaName={persona.name}
          />
        ))}

        {isLoading && status === "submitted" && (
          <TypingIndicator personaAvatar={persona.avatar} />
        )}
      </div>

      <ChatInput
        input={input}
        onChange={setInput}
        onSubmit={onSubmitMessage}
        isLoading={isLoading}
        disabled={isEnding}
      />
    </div>
  );
}
