import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const userSchema = new Schema(
  {
    penName: { type: String, required: true, trim: true, minlength: 2, maxlength: 40 },
    // Absent for demo users (and later Google-only users), so it can't be required.
    email: { type: String, trim: true, lowercase: true, maxlength: 254 },
    // Hidden from every query unless asked for with .select("+passwordHash").
    passwordHash: { type: String, select: false },
    avatarUrl: { type: String },
    isDemo: { type: Boolean, required: true, default: false },
    // Demo users only: the TTL index below deletes the user once this passes.
    expiresAt: { type: Date },
  },
  { timestamps: true },
);

// Unique only where an email exists; a plain unique index would make the second email-less demo user collide.
userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $type: "string" } } });
userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type UserRecord = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };
export const User = model("User", userSchema);
