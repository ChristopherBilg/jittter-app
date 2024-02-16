import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";
import { UserTable } from "./db/schema";

export type SessionData = {
  id: typeof UserTable.$inferSelect.id;
};

type SessionFlashData = {
  success: string;
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

const redirectIfNotAuthenticated = async (request: Request, route: string) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("id")) throw redirect(route, 302);

  return session;
};

export {
  commitSession,
  destroySession,
  getSession,
  redirectIfNotAuthenticated,
};
