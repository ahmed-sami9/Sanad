import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export const SESSION_COOKIE = "sanad_session";

export type SessionClaims = { userId: string; sessionId: string };

export function signSessionToken({ userId, sessionId }: SessionClaims, expiresAt: Date): string {
  const expiresIn = Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
  return jwt.sign({ sid: sessionId }, env.JWT_SECRET, { algorithm: "HS256", subject: userId, expiresIn });
}

// Returns null for anything invalid: bad signature, expired, wrong shape.
export function verifySessionToken(token: string): SessionClaims | null {
  try {
    // Pinning the algorithm stops a forged token from choosing a weaker one (e.g. "none").
    const payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
    if (typeof payload === "string" || typeof payload.sub !== "string" || typeof payload.sid !== "string") return null;
    return { userId: payload.sub, sessionId: payload.sid };
  } catch {
    return null;
  }
}
