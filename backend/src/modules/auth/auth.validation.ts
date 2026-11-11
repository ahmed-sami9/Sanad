import { z } from "zod";

// Limits match frontend/lib/validation/auth.ts; the server re-checks because the browser can be bypassed.
const email = z.string().trim().toLowerCase().max(254).pipe(z.email());

const penName = z.string().trim().min(2).max(40);

export const signUpSchema = z.object({
  penName,
  email,
  password: z.string().min(12).max(128),
});

// No minimum length on sign-in: a rule change later must not lock out accounts made under the old rule.
export const signInSchema = z.object({
  email,
  password: z.string().min(1).max(128),
});

export const googleSignUpSchema = z.object({ penName });

export type SignUpInput = z.output<typeof signUpSchema>;
export type SignInInput = z.output<typeof signInSchema>;
export type GoogleSignUpInput = z.output<typeof googleSignUpSchema>;
