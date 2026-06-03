// Collection endpoint: /api/beehives
//
// One file per route segment is the Next convention. Each exported function name
// is an HTTP verb (GET, POST, ...). This is the App Router's answer to a DRF
// ListCreateAPIView, but split by method instead of by class.

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { BeehiveCreateSchema } from "@/lib/schemas/beehive"
import { validationError, prismaErrorResponse } from "@/lib/http"

// GET /api/beehives — list every hive (newest first).
// Later, once auth exists, this becomes "the logged-in keeper's hives".
// Route Handlers that hit the DB aren't cached, so this always runs fresh.
export async function GET() {
  const beehives = await prisma.beehive.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(beehives)
}

// POST /api/beehives — create a hive.
// The pipeline is always the same three steps: parse JSON -> validate -> persist.
export async function POST(request: Request) {
  // 1. The body must be JSON. request.json() throws on malformed input.
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 })
  }

  // 2. Validate. safeParse never throws — it returns a tagged result we branch on.
  const parsed = BeehiveCreateSchema.safeParse(body)
  if (!parsed.success) {
    return validationError(parsed.error)
  }

  // 3. Persist. parsed.data is now fully typed and trusted. Prisma can still
  //    reject it at the DB level (e.g. duplicate unique `name` -> P2002 -> 409).
  try {
    const beehive = await prisma.beehive.create({ data: parsed.data })
    return NextResponse.json(beehive, { status: 201 })
  } catch (error) {
    const known = prismaErrorResponse(error)
    if (known) return known
    throw error // genuinely unexpected — let Next return a 500
  }
}
