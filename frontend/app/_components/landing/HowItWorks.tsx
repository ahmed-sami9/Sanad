import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

// Step 2: the three steps (check in, share, find your circle) with icons.
export async function HowItWorks() {
  const t = await getTranslations("landing.howItWorks");

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="py-16">
      <Container>
        <h2 id="how-it-works-title" className="font-serif text-4xl">
          {t("title")}
        </h2>
      </Container>
    </section>
  );
}
