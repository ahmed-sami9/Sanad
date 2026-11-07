import { cacheLife } from "next/cache";
import type { StoryPreview } from "@/types/story";
import type { CommunityPreview } from "@/types/community";
import { featuredCommunitiesMock, featuredStoriesMock } from "./mocks/landing";

// The landing page shows the same public data to every visitor, so it is cached
// instead of fetched per request. When the endpoints exist, only the return lines change.

export async function getFeaturedStories(): Promise<StoryPreview[]> {
  "use cache";
  cacheLife("minutes");
  // Later: return apiRequest<StoryPreview[]>("/stories/featured");
  return featuredStoriesMock;
}

export async function getFeaturedCommunities(): Promise<CommunityPreview[]> {
  "use cache";
  cacheLife("minutes");
  // Later: return apiRequest<CommunityPreview[]>("/circles/featured");
  return featuredCommunitiesMock;
}
