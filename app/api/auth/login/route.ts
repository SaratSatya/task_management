import { cookies } from "next/headers";
import { ZodError } from "zod";
import { successResponse, errorResponse } from "@/lib/api-response";
import { sanitizeUser } from "@/lib/auth";
import { AUTH_COOKIE_NAME, authCookieOptions } from "@/lib/cookies";
import { getErrorMessage, getZodFieldErrors } from "@/lib/errors";
import { signJwt } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import { comparePassword } from "@/lib/password";
import { loginSchema } from "@/lib/validations";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const payload = loginSchema.parse(body);

    const user = await User.findOne({ email: payload.email });

    if (!user) {
      return errorResponse("Invalid email or password", 401, {
        credentials: ["Invalid email or password"],
      });
    }

    const isValidPassword = await comparePassword(payload.password, user.password);

    if (!isValidPassword) {
      return errorResponse("Invalid email or password", 401, {
        credentials: ["Invalid email or password"],
      });
    }

    const token = signJwt({ userId: user._id.toString(), email: user.email });
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, authCookieOptions);

    return successResponse("Login successful", { user: sanitizeUser(user) });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("Validation failed", 400, getZodFieldErrors(error));
    }

    return errorResponse(getErrorMessage(error, "Failed to log in"), 500);
  }
}
