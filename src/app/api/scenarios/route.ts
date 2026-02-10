import { auth } from "@/auth";
import { readCollection, findById } from "@/lib/db";
import type { Scenario, BuyerPersona } from "@/lib/types";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Non autorise", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const scenario = findById<Scenario>("scenarios", id);
    if (!scenario) {
      return Response.json({ error: "Scenario non trouve" }, { status: 404 });
    }
    return Response.json(scenario);
  }

  const scenarios = readCollection<Scenario>("scenarios");
  const personas = readCollection<BuyerPersona>("personas");

  return Response.json({ scenarios, personas });
}
