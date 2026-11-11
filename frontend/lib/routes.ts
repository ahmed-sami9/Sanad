// One place for app paths, so a renamed route is a one-line change.
export const routes = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  forgotPassword: "/forgot-password",
  // First Google sign-up only; the backend redirects here and must use the same path.
  choosePenName: "/choose-pen-name",
  // Where people land after signing in (the signed-in app home).
  app: "/home",
  demo: "/demo",
  stories: "/stories",
  story: (slug: string) => `/stories/${slug}`,
  communities: "/communities",
  community: (slug: string) => `/communities/${slug}`,
  about: "/about",
  terms: "/terms",
  guidelines: "/guidelines",
  privacy: "/privacy",
  contact: "/contact",
} as const;
