import { after, afterEach, before, beforeEach, describe, mock, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../../app";
import { env } from "../../config/env";
import { cookieFrom } from "../../test/cookies";
import { connectTestDB, disconnectTestDB, resetTestDB } from "../../test/db";
import { User } from "../users/user.model";
import { GOOGLE_SIGNUP_COOKIE, GOOGLE_STATE_COOKIE, SESSION_COOKIE } from "./auth.tokens";
import { google, type GoogleProfile } from "./google.client";

const api = request(app);
const fern: GoogleProfile = { googleId: "google-sub-123", email: "fern@gmail.com", emailVerified: true };

// Google itself is faked: these tests check our rules, not Google's servers.
function googleReturns(profile: GoogleProfile) {
  return mock.method(google, "fetchProfile", async () => profile);
}

// Runs the first leg (our redirect to Google) and returns what Google would echo back.
async function startFlow() {
  const res = await api.get("/api/v1/auth/google");
  const state = new URL(res.headers.location).searchParams.get("state") ?? "";
  return { res, state, stateCookie: cookieFrom(res, GOOGLE_STATE_COOKIE) };
}

async function callback(state: string, stateCookie: string) {
  return api.get(`/api/v1/auth/google/callback?code=fake-code&state=${encodeURIComponent(state)}`).set("Cookie", stateCookie);
}

const landedOn = (res: request.Response) => {
  const url = new URL(res.headers.location);
  return { path: url.pathname, error: url.searchParams.get("error") };
};

before(connectTestDB);
beforeEach(resetTestDB);
afterEach(() => mock.restoreAll());
after(disconnectTestDB);

describe("GET /auth/google", () => {
  test("redirects to Google with state and PKCE, and remembers the state in a cookie", async () => {
    const { res, state } = await startFlow();
    const url = new URL(res.headers.location);

    assert.equal(res.status, 302);
    assert.equal(url.hostname, "accounts.google.com");
    assert.equal(url.searchParams.get("client_id"), env.GOOGLE_CLIENT_ID);
    assert.equal(url.searchParams.get("redirect_uri"), env.GOOGLE_CALLBACK_URL);
    assert.equal(url.searchParams.get("code_challenge_method"), "S256");
    assert.ok(url.searchParams.get("code_challenge"));
    assert.ok(state.length >= 32);
    assert.match(res.get("Set-Cookie")?.[0] ?? "", /HttpOnly/);
  });
});

describe("GET /auth/google/callback", () => {
  test("rejects a state that doesn't match the cookie, before asking Google anything", async () => {
    const fetchProfile = googleReturns(fern);
    const { stateCookie } = await startFlow();

    const res = await callback("someone-elses-state", stateCookie);
    assert.deepEqual(landedOn(res), { path: "/sign-in", error: "GOOGLE_FAILED" });

    const noCookie = await api.get("/api/v1/auth/google/callback?code=fake-code&state=x");
    assert.deepEqual(landedOn(noCookie), { path: "/sign-in", error: "GOOGLE_FAILED" });

    assert.equal(fetchProfile.mock.callCount(), 0);
    assert.equal(await User.countDocuments(), 0);
  });

  test("a cancelled Google screen returns to sign-in without an error", async () => {
    const res = await api.get("/api/v1/auth/google/callback?error=access_denied");
    assert.deepEqual(landedOn(res), { path: "/sign-in", error: null });
  });

  test("a new Google user picks a pen name before any account exists", async () => {
    googleReturns(fern);
    const { state, stateCookie } = await startFlow();

    const res = await callback(state, stateCookie);
    assert.deepEqual(landedOn(res), { path: "/choose-pen-name", error: null });
    assert.equal(await User.countDocuments(), 0);

    const done = await api
      .post("/api/v1/auth/google/complete")
      .set("Cookie", cookieFrom(res, GOOGLE_SIGNUP_COOKIE))
      .send({ penName: "Quiet Fern" });
    assert.equal(done.status, 201);
    assert.equal(done.body.user.penName, "Quiet Fern");

    const stored = await User.findOne({ googleId: fern.googleId }).select("+passwordHash").lean();
    assert.equal(stored?.email, fern.email);
    assert.equal(stored?.passwordHash, undefined);
    assert.ok(stored?.emailVerifiedAt, "Google verified the email");

    const me = await api.get("/api/v1/auth/me").set("Cookie", cookieFrom(done, SESSION_COOKIE));
    assert.equal(me.status, 200);
  });

  test("a returning Google user is signed straight in, without a second account", async () => {
    await User.create({ penName: "Quiet Fern", email: fern.email, googleId: fern.googleId });
    googleReturns(fern);
    const { state, stateCookie } = await startFlow();

    const res = await callback(state, stateCookie);
    assert.deepEqual(landedOn(res), { path: "/home", error: null });
    const me = await api.get("/api/v1/auth/me").set("Cookie", cookieFrom(res, SESSION_COOKIE));
    assert.equal(me.body.user.penName, "Quiet Fern");
    assert.equal(await User.countDocuments(), 1);
  });

  test("links to an existing account with the same email and signs into it", async () => {
    const signUp = await api.post("/api/v1/auth/sign-up").send({ penName: "Maya", email: fern.email, password: "a-long-calm-password" });
    googleReturns(fern);
    const { state, stateCookie } = await startFlow();

    const res = await callback(state, stateCookie);
    assert.deepEqual(landedOn(res), { path: "/home", error: null });
    const me = await api.get("/api/v1/auth/me").set("Cookie", cookieFrom(res, SESSION_COOKIE));
    assert.equal(me.body.user.id, signUp.body.user.id);
    assert.equal(await User.countDocuments(), 1);

    const linked = await User.findById(signUp.body.user.id).select("+passwordHash").lean();
    assert.equal(linked?.googleId, fern.googleId);
    assert.ok(linked?.emailVerifiedAt);
  });

  test("when the email was never verified, linking removes the password and ends old sessions", async () => {
    const signUp = await api.post("/api/v1/auth/sign-up").send({ penName: "Maya", email: fern.email, password: "a-long-calm-password" });
    const oldSession = cookieFrom(signUp, SESSION_COOKIE);
    googleReturns(fern);
    const { state, stateCookie } = await startFlow();
    await callback(state, stateCookie);

    // Whoever set that password never proved they own the email, so it must stop working.
    assert.equal((await api.get("/api/v1/auth/me").set("Cookie", oldSession)).status, 401);
    const signIn = await api.post("/api/v1/auth/sign-in").send({ email: fern.email, password: "a-long-calm-password" });
    assert.equal(signIn.status, 401);
  });

  test("keeps the password when the email was already verified", async () => {
    await api.post("/api/v1/auth/sign-up").send({ penName: "Maya", email: fern.email, password: "a-long-calm-password" });
    await User.updateOne({ email: fern.email }, { emailVerifiedAt: new Date() });
    googleReturns(fern);
    const { state, stateCookie } = await startFlow();
    await callback(state, stateCookie);

    const signIn = await api.post("/api/v1/auth/sign-in").send({ email: fern.email, password: "a-long-calm-password" });
    assert.equal(signIn.status, 200);
  });

  test("refuses when the email's account is linked to a different Google account", async () => {
    await User.create({ penName: "Maya", email: fern.email, googleId: "a-different-google-sub" });
    googleReturns(fern);
    const { state, stateCookie } = await startFlow();

    const res = await callback(state, stateCookie);
    assert.deepEqual(landedOn(res), { path: "/sign-in", error: "GOOGLE_EMAIL_IN_USE" });
    assert.equal(await User.countDocuments({ googleId: fern.googleId }), 0);
  });

  test("refuses an email Google hasn't verified", async () => {
    googleReturns({ ...fern, emailVerified: false });
    const { state, stateCookie } = await startFlow();

    const res = await callback(state, stateCookie);
    assert.deepEqual(landedOn(res), { path: "/sign-in", error: "GOOGLE_FAILED" });
    assert.equal(await User.countDocuments(), 0);
  });
});

describe("POST /auth/google/complete", () => {
  test("needs a valid sign-up cookie; a session token can't stand in for one", async () => {
    const missing = await api.post("/api/v1/auth/google/complete").send({ penName: "Quiet Fern" });
    assert.equal(missing.status, 401);
    assert.equal(missing.body.code, "GOOGLE_SIGNUP_EXPIRED");

    // A real, valid token, but made for a different purpose.
    const demo = await api.post("/api/v1/auth/demo");
    const sessionToken = cookieFrom(demo, SESSION_COOKIE).split("=")[1];
    const swapped = await api
      .post("/api/v1/auth/google/complete")
      .set("Cookie", `${GOOGLE_SIGNUP_COOKIE}=${sessionToken}`)
      .send({ penName: "Quiet Fern" });
    assert.equal(swapped.status, 401);
    assert.equal(await User.countDocuments({ googleId: { $exists: true } }), 0);
  });
});
