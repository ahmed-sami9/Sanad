import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../utils/AppError";

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new AppError(404, "NOT_FOUND", "Route not found"));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ code: err.code, message: err.message });
    return;
  }
  // Unknown errors: log the details, never send internals to the client.
  console.error(err);
  res.status(500).json({ code: "INTERNAL_ERROR", message: "Something went wrong" });
};
