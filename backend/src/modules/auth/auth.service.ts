import { randomInt } from "node:crypto";
import argon2 from "argon2";
import type { UserRecord } from "../users/user.model";
import * as repo from "./auth.repository";
import { invalidCredentials, unauthenticated } from "./auth.errors";
import { signSessionToken, verifySessionToken, type SessionClaims } from "./auth.tokens";
import type { SignInInput, SignUpInput } from "./auth.validation";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const DEMO_TTL_MS = 24 * 60 * 60 * 1000;

// Sign-in verifies against this when the email is unknown, so both failures take the same time.
const dummyHash = argon2.hash("not-a-real-password-only-for-timing");

// The shape the frontend expects (types/auth.ts → AuthUser); never includes the password hash.
export type AuthUser = {
  id: string;
  penName: string;
  email: string | null;
  avatarUrl: string | null;
  isDemo: boolean;
};

export type AuthResult = { user: AuthUser; token: string; expiresAt: Date };

function toAuthUser(user: UserRecord): AuthUser {
  return {
    id: user._id.toString(),
    penName: user.penName,
    email: user.email ?? null,
    avatarUrl: user.avatarUrl ?? null,
    isDemo: user.isDemo,
  };
}

export async function startSession(user: UserRecord): Promise<AuthResult> {
  // A demo session ends with its user, so the cookie never outlives the account.
  const expiresAt = user.expiresAt ?? new Date(Date.now() + SESSION_TTL_MS);
  const sessionId = await repo.createSession(user._id, expiresAt);
  const token = signSessionToken({ userId: user._id.toString(), sessionId }, expiresAt);
  return { user: toAuthUser(user), token, expiresAt };
}

export async function signUp(input: SignUpInput): Promise<AuthResult> {
  const passwordHash = await argon2.hash(input.password);
  const user = await repo.createUser({ penName: input.penName, email: input.email, passwordHash });
  return startSession(user);
}

export async function signIn(input: SignInInput): Promise<AuthResult> {
  const user = await repo.findUserByEmailWithPassword(input.email);
  if (!user?.passwordHash) {
    await argon2.verify(await dummyHash, input.password);
    throw invalidCredentials();
  }
  if (!(await argon2.verify(user.passwordHash, input.password))) throw invalidCredentials();
  return startSession(user);
}

export async function startDemo(): Promise<AuthResult> {
  const user = await repo.createUser({
    penName: `Guest ${randomInt(1000, 10000)}`,
    isDemo: true,
    expiresAt: new Date(Date.now() + DEMO_TTL_MS),
  });
  return startSession(user);
}

// A valid signature isn't enough: the session must still exist, which is what makes sign-out stick.
export async function authenticate(token: string | undefined): Promise<SessionClaims> {
  const claims = token ? verifySessionToken(token) : null;
  if (!claims) throw unauthenticated();
  const session = await repo.findActiveSession(claims.sessionId, claims.userId);
  if (!session) throw unauthenticated();
  return claims;
}

export async function getCurrentUser(userId: string): Promise<AuthUser> {
  const user = await repo.findUserById(userId);
  if (!user) throw unauthenticated();
  return toAuthUser(user);
}

// Idempotent: signing out with a missing or broken cookie still succeeds.
export async function signOut(token: string | undefined): Promise<void> {
  const claims = token ? verifySessionToken(token) : null;
  if (claims) await repo.deleteSession(claims.sessionId);
}
