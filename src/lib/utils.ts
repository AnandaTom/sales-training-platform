import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "debutant":
      return "text-green-600 bg-green-50";
    case "intermediaire":
      return "text-yellow-600 bg-yellow-50";
    case "avance":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

export function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case "debutant":
      return "Debutant";
    case "intermediaire":
      return "Intermediaire";
    case "avance":
      return "Avance";
    default:
      return difficulty;
  }
}
