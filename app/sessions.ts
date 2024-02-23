import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";
import { InferSelectModel } from "drizzle-orm";
import { User } from "./db/postgresql/models/user.server";
import { UserTable } from "./db/postgresql/schema";

export type SessionData = {
  id: InferSelectModel<typeof UserTable>["id"];
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
  if (!session.has("id")) {
    throw redirect(route, {
      status: 302,
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  const user = await User.getById(session.get("id")!);
  if (!user) {
    throw redirect(route, {
      status: 302,
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  return { user };
};

export {
  commitSession,
  destroySession,
  getSession,
  redirectIfNotAuthenticated,
};
