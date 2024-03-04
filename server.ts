import { ServerBuild, logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import { output, z } from "zod";

export const ApplicationEnvironmentVariableSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  SUPER_SECRET: z.string(),
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
  logDevReady(build as ServerBuild); // TODO: "as ServerBuild" is necessary because the types are not compatible (issue with Remix)
}

export const onRequest = createPagesFunctionHandler({
  build: build as ServerBuild, // TODO: "as ServerBuild" is necessary because the types are not compatible (issue with Remix)
  getLoadContext: ({ context }) => ({ env: context.cloudflare.env }),
  mode: process.env.NODE_ENV,
});
