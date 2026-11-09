import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import conversationsImage from "@/public/images/landing/conversations.webp";

export async function Conversations() {
  const t = await getTranslations("landing.conversations");

  return (
    // Small top padding: the image's own faded edge already gives the breathing room after the stories.
    <section aria-labelledby="conversations-title" className="relative overflow-x-clip pt-2 pb-16 md:pt-4 md:pb-24">
      {/* No frame or rounded box: the image's own soft edges fade into the page, like the hero's. */}
      <Container className="grid items-center gap-6 md:grid-cols-[1.25fr_1fr] md:gap-4">
        <Image
          src={conversationsImage}
          alt={t("imageAlt")}
          sizes="(min-width: 768px) 55vw, 100vw"
          className="h-auto w-full"
        />
        <div className="flex flex-col gap-4 text-center md:text-start">
          <h2 id="conversations-title" className="font-serif text-4xl leading-tight sm:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg">{t("subtitle")}</p>
        </div>
      </Container>
    </section>
  );
}
