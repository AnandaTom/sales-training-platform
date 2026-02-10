import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { auth } from "@/auth";
import { findById, readCollection, insert, update } from "@/lib/db";
import { buildDebriefPrompt } from "@/lib/prompts/prompt-builder";
import { v4 as uuidv4 } from "uuid";
import type {
  SimulationSession,
  BuyerPersona,
  Scenario,
  KnowledgeBaseEntry,
  Debrief,
} from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Non autorise", { status: 401 });
  }

  const { sessionId, messages: inlineMessages, personaId: inlinePersonaId, scenarioId: inlineScenarioId } = await req.json();

  // Try to load from DB first (works locally), fall back to inline data (Vercel)
  let simMessages = inlineMessages;
  let pId = inlinePersonaId;
  let sId = inlineScenarioId;

  const simSession = findById<SimulationSession>("sessions", sessionId);
  if (simSession) {
    // Check if debrief already exists
    if (simSession.debriefId) {
      const existingDebrief = findById<Debrief>("debriefs", simSession.debriefId);
      if (existingDebrief) {
        return Response.json(existingDebrief);
      }
    }
    simMessages = simMessages || simSession.messages;
    pId = pId || simSession.personaId;
    sId = sId || simSession.scenarioId;
  }

  if (!simMessages || !pId || !sId) {
    return Response.json({ error: "Session non trouvee et donnees manquantes" }, { status: 404 });
  }

  const persona = findById<BuyerPersona>("personas", pId);
  const scenario = findById<Scenario>("scenarios", sId);
  if (!persona || !scenario) {
    return Response.json({ error: "Persona ou scenario non trouve" }, { status: 404 });
  }

  const kbEntries = readCollection<KnowledgeBaseEntry>("sample-kb");

  // Build conversation transcript
  const transcript = simMessages
    .map((m: { role: string; content: string }) => `${m.role === "user" ? "VENDEUR" : persona.name}: ${m.content}`)
    .join("\n\n");

  const debriefPrompt = buildDebriefPrompt(transcript, persona, scenario, kbEntries);

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: debriefPrompt,
  });

  // Parse JSON response
  let debriefData;
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    debriefData = JSON.parse(cleaned);
  } catch {
    return Response.json({ error: "Erreur lors de l'analyse du debrief" }, { status: 500 });
  }

  const debrief: Debrief = {
    id: uuidv4(),
    sessionId,
    overallScore: debriefData.overallScore,
    summary: debriefData.summary,
    strengths: debriefData.strengths || [],
    improvements: debriefData.improvements || [],
    keyMoments: debriefData.keyMoments || [],
    nextFocus: debriefData.nextFocus || "",
    generatedAt: new Date().toISOString(),
  };

  insert("debriefs", debrief);
  update<SimulationSession>("sessions", sessionId, { debriefId: debrief.id });

  return Response.json(debrief);
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Non autorise", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const debrief = findById<Debrief>("debriefs", id);
    if (!debrief) {
      return Response.json({ error: "Debrief non trouve" }, { status: 404 });
    }
    return Response.json(debrief);
  }

  return Response.json({ error: "ID requis" }, { status: 400 });
}
