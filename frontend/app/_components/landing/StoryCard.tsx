import Image from "next/image";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { Avatar } from "@/components/ui/Avatar";
import { routes } from "@/lib/routes";
import type { StoryPreview } from "@/types/story";
import storyStrip from "@/public/images/landing/story-strip.webp";

type StoryCardProps = {
  story: StoryPreview;
  // Alternates the decorative strip's direction so neighbouring cards don't look identical.
  mirrorDecoration?: boolean;
};

export async function StoryCard({ story, mirrorDecoration = false }: StoryCardProps) {
  const t = await getTranslations("landing.stories");
  const format = await getFormatter();
  const relate = format.number(story.reactions.relate);
  const support = format.number(story.reactions.support);

  return (
    <article className="relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-shadow hover:shadow-lg hover:shadow-ink/5 focus-within:shadow-lg">
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <Avatar name={story.author.penName} src={story.author.avatarUrl} size={44} />
          <div className="flex min-w-0 flex-col">
            <span className="font-bold text-ink">{story.author.penName}</span>
            <span className="text-sm text-muted">
              {story.condition} · {t("readTime", { minutes: story.readMinutes })}
            </span>
          </div>
        </div>

        <h3 className="font-serif text-2xl leading-snug">
          {/* The ::after layer stretches the link over the whole card, so the card is one big click target. */}
          <Link href={routes.story(story.slug)} className="after:absolute after:inset-0 after:content-['']">
            {story.title}
          </Link>
        </h3>

        <p className="leading-relaxed">{story.excerpt}</p>
      </div>

      {/* Every card gets the strip: it's part of the landing page's look, not something the story data decides. */}
      <Image
        src={storyStrip}
        alt=""
        aria-hidden="true"
        sizes="(min-width: 768px) 33vw, 100vw"
        className={`mt-auto h-auto w-full ${mirrorDecoration ? "-scale-x-100" : ""}`}
      />

      <div
        className="relative -mt-12 flex flex-wrap gap-2 px-6 pb-6"
        aria-label={t("reactionsLabel", { relate, support })}
        role="img"
      >
        <span className="rounded-full bg-sage px-4 py-1.5 text-sm font-semibold text-on-solid">{t("relate", { count: relate })}</span>
        <span className="rounded-full bg-peach px-4 py-1.5 text-sm font-semibold text-peach-ink">{t("support", { count: support })}</span>
      </div>
    </article>
  );
}
