import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
}

function getScoreColor(score: number): string {
  if (score >= 8) return "text-green-600";
  if (score >= 6) return "text-yellow-600";
  if (score >= 4) return "text-orange-600";
  return "text-red-600";
}

function getScoreLabel(score: number): string {
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Bon";
  if (score >= 4) return "A ameliorer";
  return "Insuffisant";
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const percentage = (score / 10) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="50" cy="50" r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            className={getScoreColor(score)}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: "stroke-dashoffset 1s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-bold", getScoreColor(score))}>
            {score}
          </span>
          <span className="text-xs text-muted-foreground">/10</span>
        </div>
      </div>
      <p className={cn("font-semibold", getScoreColor(score))}>
        {getScoreLabel(score)}
      </p>
    </div>
  );
}
