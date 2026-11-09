// What the API returns about the signed-in person. Never includes the password or email of others.
export type AuthUser = {
  id: string;
  penName: string;
  email: string | null; // null for demo accounts
  avatarUrl: string | null;
  isDemo: boolean;
};

export type SignUpInput = {
  penName: string;
  email: string;
  password: string;
};

export type SignInInput = {
  email: string;
  password: string;
};
