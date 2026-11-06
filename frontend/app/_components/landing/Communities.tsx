import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

// Step 2: subtitle and the three community cards with member counts.
export async function Communities() {
  const t = await getTranslations("landing.communities");

  return (
    <section id="communities" aria-labelledby="communities-title" className="py-16">
      <Container>
        <h2 id="communities-title" className="font-serif text-4xl">
          {t("title")}
        </h2>
      </Container>
    </section>
  );
}
