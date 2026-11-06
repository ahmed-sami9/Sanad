import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

// Step 2: footer links and copyright line.
export async function LandingFooter() {
  const t = await getTranslations("landing.footer");

  return (
    <footer className="border-t border-border py-8">
      <Container className="flex flex-wrap items-center gap-4">
        <Logo />
        <p className="text-sm text-muted">{t("tagline")}</p>
      </Container>
    </footer>
  );
}
