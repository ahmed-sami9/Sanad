import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
import { getFeaturedStories } from "@/lib/api/landing";
import { routes } from "@/lib/routes";
import { StoryCard } from "./StoryCard";

export async function StoriesPreview() {
  const t = await getTranslations("landing.stories");
  const stories = await getFeaturedStories();

  // Nothing to preview yet (e.g. a fresh database): hide the section instead of showing an empty shell.
  if (stories.length === 0) return null;

  return (
    <section id="stories" aria-labelledby="stories-title" className="py-16 md:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-gold">{t("eyebrow")}</p>
            <h2 id="stories-title" className="font-serif text-4xl sm:text-5xl">
              {t("title")}
            </h2>
          </div>
          <Link href={routes.stories} className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink hover:text-primary-solid">
            {t("browseAll")}
            <DirectionalArrow />
          </Link>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, index) => (
            <li key={story.id} className="flex [&>article]:flex-1">
              <StoryCard story={story} mirrorDecoration={index % 2 === 1} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
