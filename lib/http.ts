// Shared HTTP helpers for our Route Handlers.
//
// Django/DRF analogy: this file is our tiny "exception handler" — the place that
// turns the two ways a write can fail into consistent JSON responses:
//   1. invalid input        -> Zod  -> 400 (like serializer.errors)
//   2. a DB constraint blew  -> Prisma -> 409 / 404 / 400
//
// Keeping it here means every route responds the same way, and the routes stay
// focused on the happy path.

import { NextResponse } from "next/server"
import * as z from "zod"

// 400 Bad Request. We hand back Zod's per-field errors — the same idea as DRF
// putting `{ "name": ["This field is required."] }` in the response body.
// Generic <T> so it accepts a ZodError for any schema without type friction.
export function validationError<T>(error: z.ZodError<T>) {
  return NextResponse.json(
    { error: "Validation failed", details: z.flattenError(error).fieldErrors },
    { status: 400 },
  )
}

// A `catch (error)` gives us `unknown`. Prisma's "known request errors" carry a
// string `code` like "P2002". We sniff for that shape rather than importing
// Prisma's error class, which keeps this helper decoupled and easy to read.
function prismaErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code: unknown }).code
    return typeof code === "string" ? code : undefined
  }
  return undefined
}

// Map the Prisma error codes these CRUD endpoints can realistically hit onto
// HTTP responses. Returns a response for the ones we recognise, or `null` so the
// caller can rethrow and let Next surface a real 500 for anything unexpected.
//
//   P2002 = unique constraint failed   -> 409 Conflict   (duplicate hive name, etc.)
//   P2025 = record to update/delete not found -> 404
//   P2003 = foreign key constraint failed -> 400 (e.g. a note pointing at a missing hive)
export function prismaErrorResponse(error: unknown): NextResponse | null {
  switch (prismaErrorCode(error)) {
    case "P2002":
      return NextResponse.json(
        { error: "A record with those unique values already exists." },
        { status: 409 },
      )
    case "P2025":
      return NextResponse.json({ error: "Not found." }, { status: 404 })
    case "P2003":
      return NextResponse.json(
        { error: "A referenced record does not exist." },
        { status: 400 },
      )
    default:
      return null
  }
}
