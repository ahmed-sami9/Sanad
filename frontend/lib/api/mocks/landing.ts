import type { StoryPreview } from "@/types/story";
import type { CommunityPreview } from "@/types/community";

// Stand-in data until the stories and circles endpoints exist. Delete this file once they do.
// User-written content (titles, excerpts, names) is never translated, so it lives here, not in messages/.

export const featuredStoriesMock: StoryPreview[] = [
  {
    id: "s1",
    slug: "stopped-apologizing-for-cancelled-plans",
    title: "The year I stopped apologizing for cancelled plans",
    excerpt: "I used to explain every change of plan. Slowly, I learned that resting needs no apology.",
    readMinutes: 4,
    author: { penName: "Maya", avatarUrl: "/images/landing/avatar-1.webp" },
    condition: "Living with Crohn’s",
    reactions: { relate: 214, support: 98 },
  },
  {
    id: "s2",
    slug: "a-small-walk-a-bigger-victory",
    title: "A small walk, a bigger victory",
    excerpt: "Some days, progress looks different. Today, it was getting outside for ten quiet minutes.",
    readMinutes: 3,
    author: { penName: "Omar", avatarUrl: "/images/landing/avatar-2.webp" },
    condition: "Living with chronic pain",
    reactions: { relate: 76, support: 41 },
  },
  {
    id: "s3",
    slug: "finding-people-who-understand",
    title: "Finding people who understand",
    excerpt: "I didn’t need someone to fix everything. I needed someone who understood the hard days.",
    readMinutes: 5,
    author: { penName: "Lina", avatarUrl: "/images/landing/avatar-3.webp" },
    condition: "Living with fatigue",
    reactions: { relate: 163, support: 67 },
  },
];

export const featuredCommunitiesMock: CommunityPreview[] = [
  {
    id: "c1",
    slug: "chronic-pain",
    name: "Chronic Pain",
    description: "A supportive space to share experiences, tips, and what helps, offered by people who get it.",
    memberCount: 1800,
    onlineCount: 42,
    illustrationUrl: "/images/landing/community-chronic-pain.webp",
  },
  {
    id: "c2",
    slug: "crohns-ibd",
    name: "Crohn’s & IBD",
    description: "A welcoming community to talk about daily life, treatment experiences, and navigating ups and downs together.",
    memberCount: 2400,
    onlineCount: 63,
    illustrationUrl: "/images/landing/community-crohns.webp",
  },
  {
    id: "c3",
    slug: "mental-wellbeing",
    name: "Mental Wellbeing",
    description: "A kind, understanding space to talk about the emotional side of living with a chronic condition.",
    memberCount: 3100,
    onlineCount: 87,
    illustrationUrl: "/images/landing/community-wellbeing.webp",
  },
];
