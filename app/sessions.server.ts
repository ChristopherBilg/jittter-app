import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";
import { InferSelectModel } from "drizzle-orm";
import { User } from "./db.server/postgresql/models/user";
import { UserTable } from "./db.server/postgresql/schema";

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
      secrets: ["FtbXxXvxg809OWogmoxeFQ5T9V2hOgPQ"],
      secure: true,
    },
  });

const redirectIfNotAuthenticated = async (
  request: Request,
  route: string,
  connectionString: string,
) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("id")) {
    throw redirect(route, {
      status: 302,
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  const user = await User.getById(connectionString, session.get("id")!);
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
