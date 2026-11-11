import { CodeChallengeMethod, OAuth2Client } from "google-auth-library";
import { env } from "../../config/env";

export type GoogleProfile = { googleId: string; email: string; emailVerified: boolean };

const client = new OAuth2Client({
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: env.GOOGLE_CALLBACK_URL,
});

// Everything that talks to Google, in one object so tests can replace it without touching the network.
export const google = {
  async createAuthRequest(state: string) {
    // PKCE: a code stolen from the redirect is useless without this verifier, which never leaves our server.
    const { codeVerifier, codeChallenge } = await client.generateCodeVerifierAsync();
    const url = client.generateAuthUrl({
      // Only what we use; "profile" (name, photo) gets added with the avatar feature.
      scope: ["openid", "email"],
      state,
      code_challenge: codeChallenge,
      code_challenge_method: CodeChallengeMethod.S256,
      prompt: "select_account",
    });
    return { url, codeVerifier: codeVerifier as string };
  },

  async fetchProfile(code: string, codeVerifier: string): Promise<GoogleProfile> {
    const { tokens } = await client.getToken({ code, codeVerifier });
    if (!tokens.id_token) throw new Error("Google returned no ID token");
    // Checks Google's signature and that the token was issued to our client, not another app.
    const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) throw new Error("Google profile is missing sub or email");
    return { googleId: payload.sub, email: payload.email.toLowerCase(), emailVerified: payload.email_verified === true };
  },
};
