import "server-only";

import { cookies } from "next/headers";
import { Types } from "mongoose";
import { AUTH_COOKIE_NAME } from "@/lib/cookies";
import { verifyJwt } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export function sanitizeUser(user: {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}): SafeUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  await connectToDatabase();

  try {
    const payload = verifyJwt(token);
    const user = await User.findById(payload.userId).lean();

    if (!user) {
      return null;
    }

    return sanitizeUser(user);
  } catch {
    return null;
  }
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
