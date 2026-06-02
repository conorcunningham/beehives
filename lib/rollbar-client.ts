import type Rollbar from "rollbar";

// Configuration for the BROWSER Rollbar instance.
//
// NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN is a "post_client_item" token and is meant
// to be public — Next inlines it into the client bundle. This object is plain
// and JSON-serializable so it can be handed from a Server Component down into
// the <Provider> Client Component as a prop.
export const clientConfig: Rollbar.Configuration = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  environment: process.env.NODE_ENV,
  // Automatically capture window.onerror and unhandled promise rejections.
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        source_map_enabled: true,
      },
    },
  },
};
