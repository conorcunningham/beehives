"use client";

import { Provider } from "@rollbar/react";
import { clientConfig } from "@/lib/rollbar-client";

// Wraps the app in the Rollbar context. The Provider builds a single browser
// Rollbar instance from clientConfig, installs the uncaught/unhandled-rejection
// handlers, and exposes the instance to descendants via the useRollbar() hook.
export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider config={clientConfig}>{children}</Provider>;
}
