import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

// Step 2: eyebrow, browse link and the three story cards with reactions.
export async function StoriesPreview() {
  const t = await getTranslations("landing.stories");

  return (
    <section id="stories" aria-labelledby="stories-title" className="py-16">
      <Container>
        <h2 id="stories-title" className="font-serif text-4xl">
          {t("title")}
        </h2>
      </Container>
    </section>
  );
}
