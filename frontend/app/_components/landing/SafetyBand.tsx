import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

// Step 2: full-width forest band, eyebrow, subtitle and the four safety items.
export async function SafetyBand() {
  const t = await getTranslations("landing.safety");

  return (
    <section id="safety" aria-labelledby="safety-title" className="py-16">
      <Container>
        <h2 id="safety-title" className="font-serif text-4xl">
          {t("title")}
        </h2>
      </Container>
    </section>
  );
}
