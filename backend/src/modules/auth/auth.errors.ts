import { AppError } from "../../utils/AppError";

export const emailTaken = () => new AppError(409, "EMAIL_TAKEN", "An account with this email already exists");

// One error for "no such email" and "wrong password", so the response can't reveal which accounts exist.
export const invalidCredentials = () => new AppError(401, "INVALID_CREDENTIALS", "Email or password is incorrect");

export const unauthenticated = () => new AppError(401, "UNAUTHENTICATED", "Not signed in");
