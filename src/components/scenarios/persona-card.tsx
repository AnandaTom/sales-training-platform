import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDifficultyColor, getDifficultyLabel } from "@/lib/utils";
import type { BuyerPersona, Scenario } from "@/lib/types";

interface PersonaCardProps {
  persona: BuyerPersona;
  scenarios: Scenario[];
  onSelect: (personaId: string, scenarioId: string) => void;
  loading: boolean;
}

export function PersonaCard({ persona, scenarios, onSelect, loading }: PersonaCardProps) {
  const compatibleScenarios = scenarios.filter((s) =>
    s.compatiblePersonas.includes(persona.id)
  );

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {persona.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{persona.name}</h3>
              <Badge
                className={getDifficultyColor(persona.difficulty)}
                variant="outline"
              >
                {getDifficultyLabel(persona.difficulty)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {persona.title} - {persona.company}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{persona.personality}</p>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Objections typiques :</p>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {persona.commonObjections.slice(0, 2).map((obj, i) => (
              <li key={i} className="italic">&ldquo;{obj}&rdquo;</li>
            ))}
          </ul>
        </div>

        {compatibleScenarios.map((scenario) => (
          <Button
            key={scenario.id}
            className="w-full"
            onClick={() => onSelect(persona.id, scenario.id)}
            disabled={loading}
          >
            {scenario.title}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
