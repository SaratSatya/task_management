import "server-only";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  MONGODB_URI: requireEnv("MONGODB_URI"),
  JWT_SECRET: requireEnv("JWT_SECRET"),
  TASK_ENCRYPTION_KEY: requireEnv("TASK_ENCRYPTION_KEY"),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
};