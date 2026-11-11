import { randomBytes } from "node:crypto";
import { z } from "zod";
import * as repo from "./auth.repository";
import { googleEmailInUse, googleFailed, googleSignUpExpired } from "./auth.errors";
import { startSession, type AuthResult } from "./auth.service";
import type { UserRecord } from "../users/user.model";
import { signPurposeToken, verifyPurposeToken } from "./auth.tokens";
import type { GoogleSignUpInput } from "./auth.validation";
import { google } from "./google.client";

const STATE_MINUTES = 10;
const SIGNUP_MINUTES = 15;

const savedState = z.object({ state: z.string(), codeVerifier: z.string() });
const pendingSignUp = z.object({ googleId: z.string(), email: z.string() });

export type GoogleOutcome =
  | { kind: "signedIn"; session: AuthResult }
  | { kind: "needsPenName"; signUpToken: string };

export async function startGoogle() {
  const state = randomBytes(32).toString("base64url");
  const { url, codeVerifier } = await google.createAuthRequest(state);
  return { url, stateToken: signPurposeToken("google_state", { state, codeVerifier }, STATE_MINUTES) };
}

export async function finishGoogle(params: { code?: string; state?: string; stateToken?: string }): Promise<GoogleOutcome> {
  // The state must come back exactly as we sent it, from the same browser; otherwise this isn't the flow we started.
  const saved = savedState.safeParse(verifyPurposeToken("google_state", params.stateToken));
  if (!saved.success || !params.code || params.state !== saved.data.state) throw googleFailed();

  const profile = await google.fetchProfile(params.code, saved.data.codeVerifier).catch(() => {
    throw googleFailed();
  });
  if (!profile.emailVerified) throw googleFailed();

  const returning = await repo.findUserByGoogleId(profile.googleId);
  if (returning) return { kind: "signedIn", session: await startSession(returning) };

  const sameEmail = await repo.findUserByEmail(profile.email);
  if (sameEmail) return { kind: "signedIn", session: await linkAndSignIn(sameEmail, profile.googleId) };

  // No user yet: the account is only created once they choose a pen name, so there are never half-made users.
  const signUpToken = signPurposeToken("google_signup", { googleId: profile.googleId, email: profile.email }, SIGNUP_MINUTES);
  return { kind: "needsPenName", signUpToken };
}

// Google just proved this person owns the email. If nobody had proven it before, the password on the account
// may have been set by someone else (pre-account takeover), so it is removed and every old session ends.
async function linkAndSignIn(user: UserRecord, googleId: string): Promise<AuthResult> {
  const unproven = !user.emailVerifiedAt;
  const linked = await repo.linkGoogleAccount(user._id, googleId, unproven);
  if (!linked) throw googleEmailInUse();
  if (unproven) await repo.deleteSessionsForUser(user._id);
  return startSession(linked);
}

export async function completeGoogleSignUp(token: string | undefined, input: GoogleSignUpInput): Promise<AuthResult> {
  const pending = pendingSignUp.safeParse(verifyPurposeToken("google_signup", token));
  if (!pending.success) throw googleSignUpExpired();

  // The unique indexes still guard races: a password account made with this email meanwhile → EMAIL_TAKEN.
  const user = await repo.createUser({
    penName: input.penName,
    email: pending.data.email,
    googleId: pending.data.googleId,
    emailVerifiedAt: new Date(),
  });
  return startSession(user);
}
