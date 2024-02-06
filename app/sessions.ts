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
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
      secrets: ["super-duper-secret"],
      secure: true,
      // domain: "example.com",
    },
  });

export { commitSession, destroySession, getSession };
