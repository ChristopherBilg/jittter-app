import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import { output, z } from "zod";

export const ApplicationEnvironmentVariableSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
});

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    env: output<typeof ApplicationEnvironmentVariableSchema>;
  }
}

declare global {
  // @ts-expect-error - We're re-declaring a global here
  const process: {
    env: ProcessEnv;
  };
}

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    const env = ApplicationEnvironmentVariableSchema.parse(context.env);
    return { env };
  },
  mode: process.env.NODE_ENV,
});
