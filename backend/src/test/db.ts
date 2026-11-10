import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db";
import { env } from "../config/env";

// Tests wipe data, so refuse to run anywhere but a database whose name ends in "_test".
export async function connectTestDB(): Promise<void> {
  if (env.NODE_ENV !== "test") throw new Error("Tests need NODE_ENV=test in backend/.env.test");
  await connectDB();
  if (!mongoose.connection.name.endsWith("_test")) {
    await disconnectDB();
    throw new Error(`Refusing to run tests against "${mongoose.connection.name}"; use a database ending in _test`);
  }
  // Indexes are database objects (like SQL constraints); tests of uniqueness and expiry need them built first.
  await Promise.all(Object.values(mongoose.models).map((model) => model.syncIndexes()));
}

export async function resetTestDB(): Promise<void> {
  await Promise.all(Object.values(mongoose.models).map((model) => model.deleteMany({})));
}

export { disconnectDB as disconnectTestDB };
