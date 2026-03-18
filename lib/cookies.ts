import { env } from "./env";

export const AUTH_COOKIE_NAME = "task_manager_token";

export const authCookieOptions = {
  httpOnly: true,
  secure: env.IS_PRODUCTION,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};