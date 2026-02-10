"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PersonaCard } from "@/components/scenarios/persona-card";
import type { BuyerPersona, Scenario } from "@/lib/types";

export default function ScenariosPage() {
  const router = useRouter();
  const [personas, setPersonas] = useState<BuyerPersona[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/scenarios");
      const data = await res.json();
      setPersonas(data.personas);
      setScenarios(data.scenarios);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSelect(personaId: string, scenarioId: string) {
    setStarting(true);
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", personaId, scenarioId }),
    });
    const session = await res.json();
    router.push(`/simulation/${session.id}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Choisir un scenario</h1>
        <p className="text-muted-foreground mt-1">
          Selectionnez un acheteur et un contexte de vente pour commencer votre simulation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {personas.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            scenarios={scenarios}
            onSelect={handleSelect}
            loading={starting}
          />
        ))}
      </div>
    </div>
  );
}
