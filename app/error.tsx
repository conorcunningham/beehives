"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { useRollbar } from "@rollbar/react";

// Catches render errors thrown by pages/segments below the root layout.
// React swallows these, so window.onerror never sees them — we must report
// them explicitly. useRollbar() reads the instance from <Provider> in layout.
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const rollbar = useRollbar();

  useEffect(() => {
    rollbar.error(error);
  }, [error, rollbar]);

  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold">Something went wrong.</h2>
      <button
        type="button"
        className="mt-4 underline"
        onClick={() => unstable_retry()}
      >
        Try again
      </button>
    </div>
  );
}
