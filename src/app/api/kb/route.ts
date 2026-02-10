import { auth } from "@/auth";
import { readCollection, insert, update, remove, findById } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import type { KnowledgeBaseEntry } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("Non autorise", { status: 401 });
  }

  const entries = readCollection<KnowledgeBaseEntry>("sample-kb");
  return Response.json(entries);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "admin") {
    return new Response("Non autorise", { status: 403 });
  }

  const body = await req.json();
  const entry: KnowledgeBaseEntry = {
    id: uuidv4(),
    title: body.title,
    category: body.category,
    content: body.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  insert("sample-kb", entry);
  return Response.json(entry);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "admin") {
    return new Response("Non autorise", { status: 403 });
  }

  const body = await req.json();
  const updated = update<KnowledgeBaseEntry>("sample-kb", body.id, {
    title: body.title,
    category: body.category,
    content: body.content,
    updatedAt: new Date().toISOString(),
  });

  if (!updated) {
    return Response.json({ error: "Entree non trouvee" }, { status: 404 });
  }

  return Response.json(updated);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "admin") {
    return new Response("Non autorise", { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "ID requis" }, { status: 400 });
  }

  const deleted = remove("sample-kb", id);
  if (!deleted) {
    return Response.json({ error: "Entree non trouvee" }, { status: 404 });
  }

  return Response.json({ success: true });
}
