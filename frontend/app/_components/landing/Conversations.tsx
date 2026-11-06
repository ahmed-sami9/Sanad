import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

// Step 2: photo and subtitle.
export async function Conversations() {
  const t = await getTranslations("landing.conversations");

  return (
    <section id="conversations" aria-labelledby="conversations-title" className="py-16">
      <Container>
        <h2 id="conversations-title" className="font-serif text-4xl">
          {t("title")}
        </h2>
      </Container>
    </section>
  );
}
