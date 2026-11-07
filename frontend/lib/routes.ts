// One place for app paths, so a renamed route is a one-line change.
export const routes = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  demo: "/demo",
  stories: "/stories",
  story: (slug: string) => `/stories/${slug}`,
  communities: "/communities",
  community: (slug: string) => `/communities/${slug}`,
  about: "/about",
  guidelines: "/guidelines",
  privacy: "/privacy",
  contact: "/contact",
} as const;
