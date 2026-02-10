import { BASE_SYSTEM_PROMPT } from "./base-system";
import type { BuyerPersona, Scenario, KnowledgeBaseEntry } from "@/lib/types";

export function buildSimulationPrompt(
  persona: BuyerPersona,
  scenario: Scenario,
  kbEntries: KnowledgeBaseEntry[]
): string {
  const personaBlock = `
YOUR PERSONA:
Name: ${persona.name}
Title: ${persona.title}
Company: ${persona.company}
Personality: ${persona.personality}
Buying Style: ${persona.buyingStyle}
Backstory: ${persona.backstory}

Your typical objections (use 2-3 of these naturally during the conversation):
${persona.commonObjections.map((o) => `- "${o}"`).join("\n")}

Your motivations (what would make you buy):
${persona.motivations.map((m) => `- ${m}`).join("\n")}

Your deal breakers (what would make you walk away):
${persona.dealBreakers.map((d) => `- ${d}`).join("\n")}
`;

  const scenarioBlock = `
SCENARIO CONTEXT:
The seller is pitching: ${scenario.productContext}
Your company situation: ${scenario.companyContext}
Deal size: ${scenario.dealSize}
Stage: ${scenario.stage}

The seller's objectives (they should try to achieve these - reward them if they do):
${scenario.objectives.map((o) => `- ${o}`).join("\n")}
`;

  const kbBlock =
    kbEntries.length > 0
      ? `
SALES METHODOLOGY REFERENCE (use this to evaluate the seller's technique):
${kbEntries.map((entry) => `### ${entry.title}\n${entry.content}`).join("\n\n")}

If the seller follows good methodology (asks discovery questions before pitching, handles objections with empathy, etc.), react more positively. If they skip steps or push too hard, react more negatively.
`
      : "";

  const openingInstruction = `
OPENING: Start the conversation as the buyer. Greet the seller briefly and set the tone based on your persona. For example:
- If you're a busy CEO, be brief: "Bonjour, j'ai 20 minutes. Allez-y."
- If you're a friendly SMB owner: "Bonjour ! On m'a parle de vous, je suis curieux d'en savoir plus."
- Match your persona's personality in the opening.
`;

  return [BASE_SYSTEM_PROMPT, personaBlock, scenarioBlock, kbBlock, openingInstruction].join("\n");
}

export function buildDebriefPrompt(
  conversationTranscript: string,
  persona: BuyerPersona,
  scenario: Scenario,
  kbEntries: KnowledgeBaseEntry[]
): string {
  const kbRubric =
    kbEntries.length > 0
      ? `
GRADING RUBRIC (based on the trainer's methodology):
${kbEntries.map((entry) => `### ${entry.title}\n${entry.content}`).join("\n\n")}
`
      : "";

  return `You are a sales coach analyzing a practice sales conversation. The seller was practicing with a simulated buyer.

SCENARIO:
- Buyer Persona: ${persona.name}, ${persona.title} at ${persona.company} (Difficulty: ${persona.difficulty})
- Stage: ${scenario.stage}
- Product: ${scenario.productContext}
- Seller's objectives were: ${scenario.objectives.join(", ")}

${kbRubric}

CONVERSATION TRANSCRIPT:
${conversationTranscript}

Analyze this conversation and provide a detailed coaching debrief. You MUST respond with valid JSON matching this exact structure:

{
  "overallScore": <number 1-10>,
  "summary": "<2-3 sentence overall assessment in French>",
  "strengths": [
    {
      "title": "<strength title in French>",
      "description": "<explanation in French>",
      "quote": "<optional exact quote from the seller that demonstrates this strength>"
    }
  ],
  "improvements": [
    {
      "title": "<improvement area in French>",
      "description": "<specific actionable suggestion in French>",
      "quote": "<optional exact quote showing where improvement is needed>"
    }
  ],
  "keyMoments": [
    {
      "type": "positive" | "negative" | "missed_opportunity",
      "title": "<moment title in French>",
      "description": "<what happened and why it matters, in French>",
      "messageIndex": <approximate message number where this occurred>
    }
  ],
  "nextFocus": "<1-2 sentences describing what to practice next, in French>"
}

Be constructive but honest. Highlight specific moments with exact quotes. Score fairly: 7+ means good technique, 5-6 is average, below 5 needs significant improvement. Respond with ONLY the JSON object, no other text.`;
}
