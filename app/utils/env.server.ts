import { output } from "zod";
import { ApplicationEnvironmentVariableSchema } from "~/server";

export function setEnvironment(
  e: output<typeof ApplicationEnvironmentVariableSchema>,
) {
  env = e;
}

export let env: output<typeof ApplicationEnvironmentVariableSchema>;
