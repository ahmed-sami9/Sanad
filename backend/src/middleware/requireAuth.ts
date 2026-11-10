import type { RequestHandler } from "express";
import { authenticate } from "../modules/auth/auth.service";
import { SESSION_COOKIE } from "../modules/auth/auth.tokens";

// Guards a route: rejects with 401, or puts the caller's ids on req.auth for the handler.
export const requireAuth: RequestHandler = async (req, _res, next) => {
  req.auth = await authenticate(req.cookies?.[SESSION_COOKIE]);
  next();
};
