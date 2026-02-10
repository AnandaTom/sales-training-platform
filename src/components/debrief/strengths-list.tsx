import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import type { DebriefItem } from "@/lib/types";

interface StrengthsListProps {
  strengths: DebriefItem[];
}

export function StrengthsList({ strengths }: StrengthsListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Points forts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {strengths.map((item, i) => (
          <div key={i} className="space-y-1">
            <h4 className="font-medium text-sm">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            {item.quote && (
              <p className="text-xs italic text-muted-foreground border-l-2 border-green-300 pl-3 mt-1">
                &ldquo;{item.quote}&rdquo;
              </p>
            )}
          </div>
        ))}
        {strengths.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun point fort identifie.</p>
        )}
      </CardContent>
    </Card>
  );
}
