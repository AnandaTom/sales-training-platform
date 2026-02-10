export interface BuyerPersona {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  difficulty: "debutant" | "intermediaire" | "avance";
  personality: string;
  buyingStyle: string;
  commonObjections: string[];
  motivations: string[];
  dealBreakers: string[];
  backstory: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  productContext: string;
  companyContext: string;
  dealSize: string;
  stage: string;
  objectives: string[];
  compatiblePersonas: string[];
}

export interface SimulationSession {
  id: string;
  userId: string;
  personaId: string;
  scenarioId: string;
  messages: ConversationMessage[];
  status: "active" | "completed" | "abandoned";
  startedAt: string;
  endedAt?: string;
  debriefId?: string;
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Debrief {
  id: string;
  sessionId: string;
  overallScore: number;
  summary: string;
  strengths: DebriefItem[];
  improvements: DebriefItem[];
  keyMoments: KeyMoment[];
  nextFocus: string;
  generatedAt: string;
}

export interface DebriefItem {
  title: string;
  description: string;
  quote?: string;
}

export interface KeyMoment {
  type: "positive" | "negative" | "missed_opportunity";
  title: string;
  description: string;
  messageIndex: number;
}

export interface KnowledgeBaseEntry {
  id: string;
  title: string;
  category: "methodology" | "objection_handling" | "closing" | "discovery" | "general";
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role: "user" | "admin";
}
