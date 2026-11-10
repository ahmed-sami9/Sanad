import type { AuthUser, SignInInput, SignUpInput } from "@/types/auth";
import { apiRequest } from "./client";

// The contract the auth module on the backend implements. The session lives in an httpOnly cookie
// that the API sets and the browser sends back automatically; the frontend never stores a token itself.

// POST /auth/sign-up → creates the account, signs it in (sets the cookie). Errors: EMAIL_TAKEN, RATE_LIMITED.
export function signUp(input: SignUpInput) {
  return apiRequest<{ user: AuthUser }>("/auth/sign-up", { method: "POST", body: JSON.stringify(input) });
}

// POST /auth/sign-in → signs in (sets the cookie). Errors: INVALID_CREDENTIALS, RATE_LIMITED.
export function signIn(input: SignInInput) {
  return apiRequest<{ user: AuthUser }>("/auth/sign-in", { method: "POST", body: JSON.stringify(input) });
}

// POST /auth/demo → creates a temporary demo account and signs it in.
export function startDemo() {
  return apiRequest<{ user: AuthUser }>("/auth/demo", { method: "POST" });
}

// GET /auth/me → the signed-in person, or 401 when there is no valid session.
export function getMe() {
  return apiRequest<{ user: AuthUser }>("/auth/me");
}

// POST /auth/sign-out → ends this session and clears the cookie. Answers 204 No Content.
export function signOut() {
  return apiRequest<void>("/auth/sign-out", { method: "POST" });
}

// GET /auth/google → a full-page redirect: the backend sends the browser to Google and back.
export function googleAuthUrl() {
  return `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
}
