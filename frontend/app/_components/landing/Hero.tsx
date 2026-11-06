import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import heroImage from "@/public/images/landing/hero.webp";

// Step 2: badge, buttons, demo hint, "read stories" link and social proof.
export async function Hero() {
  const t = await getTranslations("landing.hero");

  return (
    <section aria-labelledby="hero-title" className="pt-8 pb-16">
      <Container className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <h1 id="hero-title" className="font-serif text-5xl leading-tight">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-prose text-lg">{t("subtitle")}</p>
        </div>
        {/* The hero is above the fold, so it loads eagerly instead of lazily. */}
        <Image src={heroImage} alt={t("imageAlt")} preload sizes="(min-width: 768px) 50vw, 100vw" className="h-auto w-full" />
      </Container>
    </section>
  );
}
