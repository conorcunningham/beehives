import Rollbar from "rollbar";

// SERVER-ONLY Rollbar instance.
//
// This reads ROLLBAR_SERVER_TOKEN, which has no NEXT_PUBLIC_ prefix, so Next
// will never inline it into the browser bundle — even if this file were
// imported from client code, the token would resolve to `undefined` rather
// than leaking the secret. It is loaded lazily from instrumentation.ts so it
// only ever runs in the Node.js server runtime.
if (!process.env.ROLLBAR_SERVER_TOKEN) {
  throw new Error("ROLLBAR_SERVER_TOKEN is not set as an env var.");
}

export const serverRollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_SERVER_TOKEN,
  environment: process.env.NODE_ENV,
  captureUncaught: true,
  captureUnhandledRejections: true,
});
