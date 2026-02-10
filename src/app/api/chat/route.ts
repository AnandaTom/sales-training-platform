import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import { auth } from "@/auth";
import { findById, readCollection } from "@/lib/db";
import { buildSimulationPrompt } from "@/lib/prompts/prompt-builder";
import type { BuyerPersona, Scenario, KnowledgeBaseEntry } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Non autorise", { status: 401 });
  }

  const { messages, personaId, scenarioId } = await req.json();

  const persona = findById<BuyerPersona>("personas", personaId);
  if (!persona) {
    return new Response("Persona non trouve", { status: 404 });
  }

  const scenario = findById<Scenario>("scenarios", scenarioId);
  if (!scenario) {
    return new Response("Scenario non trouve", { status: 404 });
  }

  const kbEntries = readCollection<KnowledgeBaseEntry>("sample-kb");

  const systemPrompt = buildSimulationPrompt(persona, scenario, kbEntries);

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
