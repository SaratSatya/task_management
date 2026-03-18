import { cookies } from "next/headers";
import { successResponse } from "@/lib/api-response";
import { AUTH_COOKIE_NAME } from "@/lib/cookies";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);

  return successResponse("Logout successful");
}
