"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Rollbar from "rollbar";
import { clientConfig } from "@/lib/rollbar-client";

// Catches render errors in the ROOT layout itself. When active this component
// replaces the root layout, so it lives *outside* the <Provider> tree and
// can't use useRollbar(). We build a standalone instance to report instead.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    const rollbar = new Rollbar(clientConfig);
    rollbar.error(error);
  }, [error]);

  return (
    // global-error must render its own <html> and <body>.
    <html lang="en">
      <body>
        <h2>Something went wrong.</h2>
        <button type="button" onClick={() => unstable_retry()}>
          Try again
        </button>
      </body>
    </html>
  );
}
