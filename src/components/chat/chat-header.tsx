import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneOff } from "lucide-react";
import { getDifficultyLabel } from "@/lib/utils";

interface ChatHeaderProps {
  personaName: string;
  personaTitle: string;
  personaAvatar: string;
  personaDifficulty: string;
  scenarioStage: string;
  onEndSession: () => void;
  isEnding: boolean;
}

export function ChatHeader({
  personaName,
  personaTitle,
  personaAvatar,
  personaDifficulty,
  scenarioStage,
  onEndSession,
  isEnding,
}: ChatHeaderProps) {
  return (
    <div className="border-b bg-background px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-muted text-sm font-medium">
            {personaAvatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">{personaName}</h3>
            <Badge variant="secondary" className="text-xs">
              {getDifficultyLabel(personaDifficulty)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {personaTitle} &middot; {scenarioStage}
          </p>
        </div>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={onEndSession}
        disabled={isEnding}
      >
        <PhoneOff className="h-4 w-4 mr-2" />
        {isEnding ? "Fin..." : "Terminer"}
      </Button>
    </div>
  );
}
