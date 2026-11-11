import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../../app";
import { cookieFrom } from "../../test/cookies";
import { connectTestDB, disconnectTestDB, resetTestDB } from "../../test/db";
import { User } from "../users/user.model";
import { Session } from "./session.model";
import { SESSION_COOKIE } from "./auth.tokens";

const api = request(app);
const maya = { penName: "Maya", email: "maya@example.com", password: "a-long-calm-password" };

const sessionCookie = (res: request.Response) => cookieFrom(res, SESSION_COOKIE);

before(connectTestDB);
beforeEach(resetTestDB);
after(disconnectTestDB);

describe("POST /auth/sign-up", () => {
  test("creates the account, signs it in, and never exposes the password", async () => {
    const res = await api.post("/api/v1/auth/sign-up").send(maya);

    assert.equal(res.status, 201);
    assert.deepEqual(res.body.user, {
      id: res.body.user.id,
      penName: "Maya",
      email: "maya@example.com",
      avatarUrl: null,
      isDemo: false,
    });
    assert.match(res.headers["set-cookie"][0], /HttpOnly/);

    const stored = await User.findOne({ email: maya.email }).select("+passwordHash").lean();
    assert.ok(stored?.passwordHash?.startsWith("$argon2id$"));
    assert.notEqual(stored?.passwordHash, maya.password);
  });

  test("stores the email lowercased, so a different case is the same account", async () => {
    const first = await api.post("/api/v1/auth/sign-up").send({ ...maya, email: "  Maya@Example.COM " });
    assert.equal(first.body.user.email, "maya@example.com");

    const second = await api.post("/api/v1/auth/sign-up").send({ ...maya, email: "MAYA@example.com" });
    assert.equal(second.status, 409);
    assert.equal(second.body.code, "EMAIL_TAKEN");
    assert.equal(await User.countDocuments(), 1);
  });

  test("rejects invalid input without creating anyone", async () => {
    const invalid = [
      { ...maya, password: "too-short" },
      { ...maya, email: "not-an-email" },
      { ...maya, penName: "  " },
      { email: maya.email, password: maya.password },
    ];
    for (const body of invalid) {
      const res = await api.post("/api/v1/auth/sign-up").send(body);
      assert.equal(res.status, 400, JSON.stringify(body));
      assert.equal(res.body.code, "VALIDATION_ERROR");
    }
    assert.equal(await User.countDocuments(), 0);
  });
});

describe("POST /auth/sign-in", () => {
  test("signs in with the email in any letter case", async () => {
    const signUp = await api.post("/api/v1/auth/sign-up").send(maya);
    const res = await api.post("/api/v1/auth/sign-in").send({ email: "MAYA@EXAMPLE.COM", password: maya.password });

    assert.equal(res.status, 200);
    assert.equal(res.body.user.id, signUp.body.user.id);
    sessionCookie(res);
  });

  test("answers a wrong password and an unknown email identically", async () => {
    await api.post("/api/v1/auth/sign-up").send(maya);
    const wrongPassword = await api.post("/api/v1/auth/sign-in").send({ email: maya.email, password: "not-her-password" });
    const unknownEmail = await api.post("/api/v1/auth/sign-in").send({ email: "nobody@example.com", password: "whatever-password" });

    assert.equal(wrongPassword.status, 401);
    assert.equal(unknownEmail.status, 401);
    assert.deepEqual(wrongPassword.body, unknownEmail.body);
    assert.equal(wrongPassword.body.code, "INVALID_CREDENTIALS");
  });
});

describe("sessions: GET /auth/me and POST /auth/sign-out", () => {
  test("/me returns the user only with a valid, untampered cookie", async () => {
    const cookie = sessionCookie(await api.post("/api/v1/auth/sign-up").send(maya));

    const ok = await api.get("/api/v1/auth/me").set("Cookie", cookie);
    assert.equal(ok.status, 200);
    assert.equal(ok.body.user.email, maya.email);

    const none = await api.get("/api/v1/auth/me");
    assert.equal(none.status, 401);
    assert.equal(none.body.code, "UNAUTHENTICATED");

    const tampered = cookie.slice(0, -2) + (cookie.endsWith("aa") ? "bb" : "aa");
    assert.equal((await api.get("/api/v1/auth/me").set("Cookie", tampered)).status, 401);
  });

  test("sign-out revokes the session, so the old cookie stops working", async () => {
    const cookie = sessionCookie(await api.post("/api/v1/auth/sign-up").send(maya));

    const out = await api.post("/api/v1/auth/sign-out").set("Cookie", cookie);
    assert.equal(out.status, 204);
    assert.match(out.headers["set-cookie"][0], /Expires=Thu, 01 Jan 1970/);
    assert.equal(await Session.countDocuments(), 0);

    // The token's signature is still valid; only the deleted session makes this fail.
    assert.equal((await api.get("/api/v1/auth/me").set("Cookie", cookie)).status, 401);
  });

  test("an expired session is rejected even before MongoDB deletes it", async () => {
    const cookie = sessionCookie(await api.post("/api/v1/auth/sign-up").send(maya));
    await Session.updateMany({}, { expiresAt: new Date(Date.now() - 1000) });

    assert.equal((await api.get("/api/v1/auth/me").set("Cookie", cookie)).status, 401);
  });
});

describe("POST /auth/demo", () => {
  test("gives each visitor a separate temporary account", async () => {
    const first = await api.post("/api/v1/auth/demo");
    const second = await api.post("/api/v1/auth/demo");

    assert.equal(first.status, 201);
    assert.equal(second.status, 201);
    assert.notEqual(first.body.user.id, second.body.user.id);
    assert.equal(first.body.user.isDemo, true);
    assert.equal(first.body.user.email, null);

    const demo = await User.findById(first.body.user.id).lean();
    const hoursLeft = (demo!.expiresAt!.getTime() - Date.now()) / 3_600_000;
    assert.ok(hoursLeft > 23.9 && hoursLeft <= 24, `expected about 24h, got ${hoursLeft}`);

    for (const res of [first, second]) {
      const me = await api.get("/api/v1/auth/me").set("Cookie", sessionCookie(res));
      assert.equal(me.status, 200);
    }
  });
});
