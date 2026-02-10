import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TypingIndicatorProps {
  personaAvatar?: string;
}

export function TypingIndicator({ personaAvatar }: TypingIndicatorProps) {
  return (
    <div className="flex gap-3 px-4">
      <Avatar className="h-8 w-8 shrink-0 bg-muted">
        <AvatarFallback className="text-xs bg-muted">{personaAvatar || "AI"}</AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
