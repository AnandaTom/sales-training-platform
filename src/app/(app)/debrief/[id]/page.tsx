"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ScoreDisplay } from "@/components/debrief/score-display";
import { StrengthsList } from "@/components/debrief/strengths-list";
import { ImprovementsList } from "@/components/debrief/improvements-list";
import { KeyMoments } from "@/components/debrief/key-moments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Target } from "lucide-react";
import type { Debrief } from "@/lib/types";

export default function DebriefPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const [debrief, setDebrief] = useState<Debrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDebrief() {
      try {
        // Read conversation data from sessionStorage (set by chat-interface)
        const stored = sessionStorage.getItem(`debrief-${sessionId}`);
        const payload = stored
          ? { sessionId, ...JSON.parse(stored) }
          : { sessionId };

        const res = await fetch("/api/debrief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          setError("Erreur lors de la generation du debrief");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setDebrief(data);

        // Clean up sessionStorage
        if (stored) sessionStorage.removeItem(`debrief-${sessionId}`);
      } catch {
        setError("Erreur de connexion");
      }
      setLoading(false);
    }

    loadDebrief();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Analyse de votre conversation en cours...</p>
          <p className="text-xs text-muted-foreground mt-1">Cela peut prendre quelques secondes</p>
        </div>
      </div>
    );
  }

  if (error || !debrief) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-destructive">{error || "Debrief non disponible"}</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard")}>
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Debrief de votre simulation</h1>
          <p className="text-muted-foreground mt-1">{debrief.summary}</p>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <ScoreDisplay score={debrief.overallScore} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StrengthsList strengths={debrief.strengths} />
        <ImprovementsList improvements={debrief.improvements} />
      </div>

      <KeyMoments moments={debrief.keyMoments} />

      {debrief.nextFocus && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Prochain objectif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{debrief.nextFocus}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tableau de bord
        </Button>
        <Button onClick={() => router.push("/scenarios")}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Nouvelle simulation
        </Button>
      </div>
    </div>
  );
}
