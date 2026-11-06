import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

// Step 2: illustrated band (desktop and mobile images) and both buttons.
export async function ClosingCta() {
  const t = await getTranslations("landing.cta");

  return (
    <section id="closing-cta" aria-labelledby="closing-cta-title" className="py-16">
      <Container>
        <h2 id="closing-cta-title" className="font-serif text-4xl">
          {t("title")}
        </h2>
      </Container>
    </section>
  );
}
