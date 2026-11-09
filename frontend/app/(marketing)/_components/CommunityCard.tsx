import Image from "next/image";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
import { routes } from "@/lib/routes";
import type { CommunityPreview } from "@/types/community";

export async function CommunityCard({ community }: { community: CommunityPreview }) {
  const t = await getTranslations("landing.communities");
  const format = await getFormatter();

  return (
    <article className="relative flex h-full gap-4 rounded-3xl border border-border bg-surface p-6 transition-shadow hover:shadow-lg hover:shadow-ink/5 focus-within:shadow-lg">
      <Image src={community.illustrationUrl} alt="" aria-hidden="true" width={84} height={108} className="h-auto w-20 shrink-0 self-center" />

      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="font-serif text-2xl">{community.name}</h3>
        <p className="text-[15px] leading-relaxed">{community.description}</p>

        <p className="flex items-center gap-2 text-sm text-muted">
          <span aria-hidden="true" className="size-2 rounded-full bg-online" />
          {t("members", {
            count: community.memberCount,
            formatted: format.number(community.memberCount, { notation: "compact" }),
          })}
          {" · "}
          {t("online", { formatted: format.number(community.onlineCount) })}
        </p>

        <Link
          href={routes.community(community.slug)}
          aria-label={t("exploreLabel", { name: community.name })}
          className="mt-auto inline-flex min-h-11 items-center gap-2 font-semibold text-ink after:absolute after:inset-0 after:content-[''] hover:text-primary-solid"
        >
          {t("explore")}
          <DirectionalArrow />
        </Link>
      </div>
    </article>
  );
}
