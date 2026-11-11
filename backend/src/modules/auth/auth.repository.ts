import { mongo, Types } from "mongoose";
import { User, type UserRecord } from "../users/user.model";
import { Session } from "./session.model";
import { emailTaken } from "./auth.errors";

type NewUser = {
  penName: string;
  email?: string;
  passwordHash?: string;
  googleId?: string;
  emailVerifiedAt?: Date;
  isDemo?: boolean;
  expiresAt?: Date;
};

// Inserts directly and lets the unique index reject duplicates; a "find first" check would race.
export async function createUser(data: NewUser): Promise<UserRecord> {
  try {
    const user = await User.create(data);
    return user.toObject();
  } catch (err) {
    if (err instanceof mongo.MongoServerError && err.code === 11000) throw emailTaken();
    throw err;
  }
}

export function findUserByEmailWithPassword(email: string) {
  return User.findOne({ email }).select("+passwordHash").lean<UserRecord>();
}

export function findUserByGoogleId(googleId: string) {
  return User.findOne({ googleId }).lean<UserRecord>();
}

export function findUserByEmail(email: string) {
  return User.findOne({ email }).lean<UserRecord>();
}

// Attaches a Google account to an existing user. The filter makes it a no-op (null) if another Google id got there first.
export function linkGoogleAccount(userId: Types.ObjectId, googleId: string, removePassword: boolean) {
  return User.findOneAndUpdate(
    { _id: userId, googleId: { $exists: false } },
    { $set: { googleId, emailVerifiedAt: new Date() }, ...(removePassword && { $unset: { passwordHash: 1 } }) },
    { new: true },
  ).lean<UserRecord>();
}

export async function deleteSessionsForUser(userId: Types.ObjectId): Promise<void> {
  await Session.deleteMany({ userId });
}

export function findUserById(id: string) {
  if (!Types.ObjectId.isValid(id)) return Promise.resolve(null);
  return User.findById(id).lean<UserRecord>();
}

export async function createSession(userId: Types.ObjectId, expiresAt: Date): Promise<string> {
  const session = await Session.create({ userId, expiresAt });
  return session._id.toString();
}

// Checks expiry here too: MongoDB's TTL cleanup runs about once a minute, so an expired session can still exist.
export function findActiveSession(sessionId: string, userId: string) {
  if (!Types.ObjectId.isValid(sessionId) || !Types.ObjectId.isValid(userId)) return Promise.resolve(null);
  return Session.findOne({ _id: sessionId, userId, expiresAt: { $gt: new Date() } }).lean();
}

export async function deleteSession(sessionId: string): Promise<void> {
  if (!Types.ObjectId.isValid(sessionId)) return;
  await Session.deleteOne({ _id: sessionId });
}
