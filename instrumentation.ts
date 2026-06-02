import { type Instrumentation } from "next";

// Next calls onRequestError whenever the server captures an uncaught error
// (Server Components, Route Handlers, Server Actions). We forward it to
// Rollbar. See node_modules/next/dist/docs/01-app/.../instrumentation.md
export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  // The Rollbar server SDK depends on Node APIs, so do nothing on the Edge
  // runtime. The lazy import also keeps the server token out of the Edge bundle.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { serverRollbar } = await import("@/lib/rollbar");

  // Send only safe request metadata — not raw headers, which may carry cookies.
  serverRollbar.error(err as Error, {
    request: { path: request.path, method: request.method },
    context,
  });
};
