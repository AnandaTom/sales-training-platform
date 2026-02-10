import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import type { DebriefItem } from "@/lib/types";

interface ImprovementsListProps {
  improvements: DebriefItem[];
}

export function ImprovementsList({ improvements }: ImprovementsListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Axes d&apos;amelioration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {improvements.map((item, i) => (
          <div key={i} className="space-y-1">
            <h4 className="font-medium text-sm">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            {item.quote && (
              <p className="text-xs italic text-muted-foreground border-l-2 border-yellow-300 pl-3 mt-1">
                &ldquo;{item.quote}&rdquo;
              </p>
            )}
          </div>
        ))}
        {improvements.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun axe d&apos;amelioration identifie.</p>
        )}
      </CardContent>
    </Card>
  );
}
