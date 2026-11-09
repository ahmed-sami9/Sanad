import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
import { Avatar } from "@/components/ui/Avatar";
import { routes } from "@/lib/routes";
import heroImage from "@/public/images/landing/hero.webp";

const socialProofAvatars = [
  { name: "Maya", src: "/images/landing/avatar-1.webp" },
  { name: "Omar", src: "/images/landing/avatar-2.webp" },
  { name: "Lina", src: "/images/landing/avatar-3.webp" },
];

export async function Hero() {
  const t = await getTranslations("landing.hero");
  const tc = await getTranslations("common");

  return (
    // overflow-x-clip: the image deliberately extends past the container's edge on wide screens.
    <section
      aria-labelledby="hero-title"
      className="overflow-x-clip pt-6 pb-16 md:pt-10 md:pb-24"
    >
      {/* items-start: the image's top edge lines up with the top of the badge, the first thing in the text column. */}
      <Container className="grid items-start gap-10 md:grid-cols-[1fr_1.05fr] md:gap-6">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-1.5 text-sm font-semibold text-ink">
            <Sparkles
              aria-hidden="true"
              className="size-4 text-gold"
              strokeWidth={1.75}
            />
            {t("badge")}
          </span>

          <h1
            id="hero-title"
            className="font-serif text-[2.75rem] leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {t("title")}
          </h1>

          <p className="max-w-[34rem] text-lg leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-start">
            <ButtonLink href={routes.signUp} size="lg">
              {tc("join")}
            </ButtonLink>
            <div className="flex flex-col items-center gap-1.5">
              <ButtonLink
                href={routes.demo}
                variant="secondary"
                size="lg"
                className="w-full"
                aria-describedby="demo-hint"
              >
                {tc("tryDemo")}
              </ButtonLink>
              <span id="demo-hint" className="text-xs text-muted">
                {t("demoHint")}
              </span>
            </div>
          </div>

          <Link
            href={routes.stories}
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink hover:text-primary-solid"
          >
            {t("readStories")}
            <DirectionalArrow />
          </Link>

          <div className="flex items-center gap-4">
            <div
              className="flex -space-x-3 rtl:space-x-reverse"
              role="img"
              aria-label={t("socialProofLabel")}
            >
              {socialProofAvatars.map((avatar) => (
                <Avatar
                  key={avatar.name}
                  name={avatar.name}
                  src={avatar.src}
                  size={44}
                  className="ring-2 ring-background"
                />
              ))}
            </div>
            <span aria-hidden="true" className="h-8 w-px bg-border" />
            <p className="text-sm">{t("socialProof")}</p>
          </div>
        </div>

        {/* Above the fold, so it is preloaded instead of lazy-loaded.
            On wide screens it bleeds past the edge; its soft edges fade into the page. */}
        <Image
          src={heroImage}
          alt={t("imageAlt")}
          preload
          sizes="(min-width: 768px) 55vw, 100vw"
          className="mx-auto h-auto w-full max-w-xl md:w-[106%] md:max-w-none lg:w-[110%] lg:-mt-5"
        />
      </Container>
    </section>
  );
}
