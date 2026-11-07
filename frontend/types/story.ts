// The shape the backend will return for a story card. Mock data in lib/api/mocks follows it exactly.
export type StoryPreview = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  author: {
    penName: string;
    avatarUrl: string | null; // null → show initials
  };
  // The condition the author chose to show on this story.
  condition: string;
  reactions: {
    relate: number;
    support: number;
  };
};
