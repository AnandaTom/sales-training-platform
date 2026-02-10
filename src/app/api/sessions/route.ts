import { auth } from "@/auth";
import { readCollection, insert, findById, update } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import type { SimulationSession } from "@/lib/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Non autorise", { status: 401 });
  }

  const body = await req.json();

  // Create new session
  if (body.action === "create") {
    const simSession: SimulationSession = {
      id: uuidv4(),
      userId: (session.user as { id: string }).id,
      personaId: body.personaId,
      scenarioId: body.scenarioId,
      messages: [],
      status: "active",
      startedAt: new Date().toISOString(),
    };

    insert("sessions", simSession);
    return Response.json(simSession);
  }

  // Save messages to session
  if (body.action === "save-messages") {
    const updated = update<SimulationSession>("sessions", body.sessionId, {
      messages: body.messages,
    });
    return Response.json(updated);
  }

  // End session
  if (body.action === "end") {
    const updated = update<SimulationSession>("sessions", body.sessionId, {
      status: "completed",
      endedAt: new Date().toISOString(),
      messages: body.messages,
    });
    return Response.json(updated);
  }

  return Response.json({ error: "Action non reconnue" }, { status: 400 });
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Non autorise", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const simSession = findById<SimulationSession>("sessions", id);
    return Response.json(simSession);
  }

  // Get all sessions for this user
  const userId = (session.user as { id: string }).id;
  const allSessions = readCollection<SimulationSession>("sessions");
  const userSessions = allSessions
    .filter((s) => s.userId === userId)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  return Response.json(userSessions);
}
