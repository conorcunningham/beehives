// Detail endpoint: /api/beehives/:id
//
// The `[id]` folder name is the dynamic segment (like Django's <str:id> in a URL
// pattern). This is the App Router's DRF RetrieveUpdateDestroyAPIView.

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { BeehiveUpdateSchema } from "@/lib/schemas/beehive"
import { validationError, prismaErrorResponse } from "@/lib/http"

// GOTCHA for this version of Next: route params arrive as a PROMISE. You must
// await them. (They used to be a plain object — a classic training-data trap.)
// Once you've run `next dev`/`next typegen` you can swap this for the generated
// `RouteContext<'/api/beehives/[id]'>` helper; this hand-written type works today.
type Context = { params: Promise<{ id: string }> }

// GET /api/beehives/:id — fetch one, or 404.
export async function GET(_request: Request, { params }: Context) {
  const { id } = await params
  const beehive = await prisma.beehive.findUnique({ where: { id } })
  if (!beehive) {
    return NextResponse.json({ error: "Beehive not found." }, { status: 404 })
  }
  return NextResponse.json(beehive)
}

// PATCH /api/beehives/:id — partial update (DRF's partial=True).
export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 })
  }

  const parsed = BeehiveUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return validationError(parsed.error)
  }

  try {
    const beehive = await prisma.beehive.update({ where: { id }, data: parsed.data })
    return NextResponse.json(beehive)
  } catch (error) {
    // update() on a missing id throws P2025 -> our helper turns that into a 404.
    const known = prismaErrorResponse(error)
    if (known) return known
    throw error
  }
}

// DELETE /api/beehives/:id — remove it. 204 No Content on success (empty body).
export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params
  try {
    await prisma.beehive.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const known = prismaErrorResponse(error) // P2025 -> 404
    if (known) return known
    throw error
  }
}
