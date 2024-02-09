import { createCookieSessionStorage } from "@remix-run/cloudflare";
import { UserTable } from "./db/schema";

type SessionData = {
  id: typeof UserTable.$inferSelect.id;
  firstName: typeof UserTable.$inferSelect.firstName;
  lastName: typeof UserTable.$inferSelect.lastName;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      // TODO: Figure out how to get the secret from the environment and add automation to periodically change it
      secrets: ["FtbXxXvxg809OWogmoxeFQ5T9V2hOgPQ"],
      secure: true,
    },
  });

export { commitSession, destroySession, getSession };
