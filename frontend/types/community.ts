// The shape the backend will return for a community (circle) card.
export type CommunityPreview = {
  id: string;
  slug: string;
  name: string;
  description: string;
  memberCount: number;
  onlineCount: number;
  illustrationUrl: string;
};
