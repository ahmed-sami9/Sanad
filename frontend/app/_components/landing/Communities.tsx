import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getFeaturedCommunities } from "@/lib/api/landing";
import { CommunityCard } from "./CommunityCard";
import { LeafDecor } from "./LeafDecor";

export async function Communities() {
  const t = await getTranslations("landing.communities");
  const communities = await getFeaturedCommunities();

  if (communities.length === 0) return null;

  return (
    <section id="communities" aria-labelledby="communities-title" className="relative overflow-x-clip py-16 md:py-24">
      {/* Mirrored images and a different arrangement from "How it works", so the two sections don't look copy-pasted. */}
      <LeafDecor variant="right" flip className="-start-6 top-2 w-32 rotate-[10deg] opacity-75" />
      <LeafDecor variant="left" flip className="-end-8 top-20 w-44 -rotate-[12deg] opacity-85" />

      <Container>
        <div className="mx-auto flex max-w-2xl flex-col gap-4 text-center">
          <h2 id="communities-title" className="font-serif text-4xl sm:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg">{t("subtitle")}</p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <li key={community.id}>
              <CommunityCard community={community} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
