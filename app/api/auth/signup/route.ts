import { cookies } from "next/headers";
import { ZodError } from "zod";
import { successResponse, errorResponse } from "@/lib/api-response";
import { sanitizeUser } from "@/lib/auth";
import { AUTH_COOKIE_NAME, authCookieOptions } from "@/lib/cookies";
import { getErrorMessage, getZodFieldErrors } from "@/lib/errors";
import { signJwt } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";
import { signupSchema } from "@/lib/validations";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const payload = signupSchema.parse(body);

    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
      return errorResponse("An account with this email already exists", 409, {
        email: ["Email is already in use"],
      });
    }

    const hashedPassword = await hashPassword(payload.password);
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    });

    const token = signJwt({ userId: user._id.toString(), email: user.email });
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, authCookieOptions);

    return successResponse("Signup successful", { user: sanitizeUser(user) }, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("Validation failed", 400, getZodFieldErrors(error));
    }

    return errorResponse(getErrorMessage(error, "Failed to sign up"), 500);
  }
}
