import assert from "node:assert/strict";
import type { Response } from "supertest";

// Returns "name=value" from a response's Set-Cookie, ready to send back as a Cookie header.
export function cookieFrom(res: Response, name: string): string {
  const cookie = (res.get("Set-Cookie") ?? []).find((c) => c.startsWith(`${name}=`));
  assert.ok(cookie, `expected a ${name} cookie`);
  return cookie.split(";")[0];
}
