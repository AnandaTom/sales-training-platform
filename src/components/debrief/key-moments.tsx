import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import type { KeyMoment } from "@/lib/types";

interface KeyMomentsProps {
  moments: KeyMoment[];
}

function getMomentBadge(type: KeyMoment["type"]) {
  switch (type) {
    case "positive":
      return <Badge variant="success">Positif</Badge>;
    case "negative":
      return <Badge variant="destructive">A revoir</Badge>;
    case "missed_opportunity":
      return <Badge variant="warning">Opportunite manquee</Badge>;
  }
}

export function KeyMoments({ moments }: KeyMomentsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Moments cles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {moments.map((moment, i) => (
          <div key={i} className="flex gap-3">
            <div className="shrink-0 mt-0.5">{getMomentBadge(moment.type)}</div>
            <div>
              <h4 className="font-medium text-sm">{moment.title}</h4>
              <p className="text-sm text-muted-foreground">{moment.description}</p>
            </div>
          </div>
        ))}
        {moments.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun moment cle identifie.</p>
        )}
      </CardContent>
    </Card>
  );
}
