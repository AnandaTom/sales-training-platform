"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Clock, Play } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { SimulationSession } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SimulationSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/sessions");
      const data = await res.json();
      setSessions(data);
      setLoading(false);
    }
    load();
  }, []);

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const totalSessions = sessions.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Suivez votre progression et lancez de nouvelles simulations.
          </p>
        </div>
        <Button onClick={() => router.push("/scenarios")}>
          <Play className="h-4 w-4 mr-2" />
          Nouvelle simulation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Simulations totales
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completees
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedSessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Derniere session
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {sessions.length > 0
                ? formatDate(sessions[0].startedAt)
                : "Aucune session"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session history */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Vous n&apos;avez pas encore realise de simulation.
              </p>
              <Button onClick={() => router.push("/scenarios")}>
                Commencer maintenant
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-sm">
                        {session.personaId} - {session.scenarioId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(session.startedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={session.status === "completed" ? "success" : "secondary"}
                    >
                      {session.status === "completed" ? "Terminee" : "En cours"}
                    </Badge>
                    {session.status === "completed" && session.debriefId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/debrief/${session.id}`)}
                      >
                        Voir debrief
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
