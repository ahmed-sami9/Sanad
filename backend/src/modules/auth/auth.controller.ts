import type { CookieOptions, Request, Response } from "express";
import { env } from "../../config/env";
import { parseInput } from "../../utils/validate";
import * as authService from "./auth.service";
import { SESSION_COOKIE } from "./auth.tokens";
import { signInSchema, signUpSchema } from "./auth.validation";

// httpOnly keeps the token away from page scripts (XSS); lax blocks it on cross-site form posts (CSRF).
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

function sendSession(res: Response, status: number, result: authService.AuthResult) {
  res.cookie(SESSION_COOKIE, result.token, { ...cookieOptions, expires: result.expiresAt });
  res.status(status).json({ user: result.user });
}

export async function signUp(req: Request, res: Response) {
  const input = parseInput(signUpSchema, req.body);
  sendSession(res, 201, await authService.signUp(input));
}

export async function signIn(req: Request, res: Response) {
  const input = parseInput(signInSchema, req.body);
  sendSession(res, 200, await authService.signIn(input));
}

export async function startDemo(_req: Request, res: Response) {
  sendSession(res, 201, await authService.startDemo());
}

export async function me(req: Request, res: Response) {
  res.json({ user: await authService.getCurrentUser(req.auth!.userId) });
}

export async function signOut(req: Request, res: Response) {
  await authService.signOut(req.cookies?.[SESSION_COOKIE]);
  res.clearCookie(SESSION_COOKIE, cookieOptions);
  res.status(204).end();
}
