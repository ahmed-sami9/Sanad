import "dotenv/config";
import { z } from "zod";

// Fail at startup, not mid-request, if config is missing.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5001),
  MONGODB_URI: z.string().min(1),
  CLIENT_ORIGIN: z.url(),
  // Signs session tokens; anyone holding it can forge a sign-in, so it must be long and secret.
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  // Must match a redirect URI registered on the Google client exactly.
  GOOGLE_CALLBACK_URL: z.url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", z.flattenError(parsed.error).fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
