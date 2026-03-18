import "server-only";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "./env";

export type JwtPayload = {
  userId: string;
  email: string;
};

const JWT_EXPIRES_IN = "7d";

export function signJwt(payload: JwtPayload) {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}