"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChatInterface } from "@/components/chat/chat-interface";
import type { BuyerPersona, Scenario, SimulationSession } from "@/lib/types";

export default function SimulationPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [session, setSession] = useState<SimulationSession | null>(null);
  const [persona, setPersona] = useState<BuyerPersona | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const res = await fetch(`/api/sessions?id=${sessionId}`);
      const sessionData = await res.json();
      setSession(sessionData);

      const scenarioRes = await fetch(`/api/scenarios?id=${sessionData.scenarioId}`);
      const scenarioData = await scenarioRes.json();
      setScenario(scenarioData);

      // Load personas to find the right one
      const allRes = await fetch("/api/scenarios");
      const { personas } = await allRes.json();
      const p = personas.find((p: BuyerPersona) => p.id === sessionData.personaId);
      setPersona(p);

      setLoading(false);
    }

    loadSession();
  }, [sessionId]);

  if (loading || !session || !persona || !scenario) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de la simulation...</p>
        </div>
      </div>
    );
  }

  return <ChatInterface sessionId={sessionId} persona={persona} scenario={scenario} />;
}
