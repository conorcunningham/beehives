// The validation ("serializer") layer for Beehive.
//
// Division of labour, the same one you know from Django:
//   Prisma  = persistence       (models.py + the DB)
//   Zod     = the request boundary (DRF serializer / Pydantic model)
//
// `z.strictObject` is the "strict" you asked for: any key the client sends that
// we didn't declare is REJECTED. DRF doesn't do that out of the box; this is
// closer to Pydantic's `extra="forbid"`. It stops typos and mass-assignment.

import * as z from "zod"
import { QueenColour } from "@/generated/prisma/enums"

// What a client may send when CREATING a hive.
// Note what's deliberately absent:
//   - id / createdAt / updatedAt are server-controlled (never trust the client for these)
//   - beekeepers is omitted for now; once auth lands we'll connect the logged-in
//     user as a keeper here, server-side.
export const BeehiveCreateSchema = z.strictObject({
  name: z.string().trim().min(1, { error: "Name is required." }),

  // The 1..5 range Prisma cannot express in the schema — enforced here, exactly
  // as the plan called out. This IS the reason the validation layer exists.
  strength: z
    .number()
    .int({ error: "Strength must be a whole number." })
    .min(1, { error: "Strength must be between 1 and 5." })
    .max(5, { error: "Strength must be between 1 and 5." }),
  skattekasser: z
    .number()
    .int({ error: "Honey supers must be a whole number." })
    .min(1, { error: "Honey supers must be between 1 and 5." })
    .max(5, { error: "Honey supers must be between 1 and 5." }),

  // Zod 4 reads the allowed values straight off the generated Prisma enum object.
  // (Older Zod needed z.nativeEnum(); not anymore.)
  queenColour: z.enum(QueenColour, { error: "Pick a valid queen-marking colour." }),
})

// Updates are partial (PATCH semantics): every field optional, still strict, and
// we reject an empty body — a PATCH that changes nothing is almost always a bug.
export const BeehiveUpdateSchema = BeehiveCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { error: "Provide at least one field to update." },
)

// Inferred TS types — the typed, validated data you get back from safeParse,
// analogous to `serializer.validated_data` but statically typed.
export type BeehiveCreateInput = z.infer<typeof BeehiveCreateSchema>
export type BeehiveUpdateInput = z.infer<typeof BeehiveUpdateSchema>
