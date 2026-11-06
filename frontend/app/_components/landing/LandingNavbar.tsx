import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Logo } from "@/components/ui/Logo";
import { routes } from "@/lib/routes";

// Step 2: mobile menu (hamburger) and final spacing.
export async function LandingNavbar() {
  const t = await getTranslations("landing.nav");
  const tc = await getTranslations("common");

  const links = [
    { href: "#communities", label: t("communities") },
    { href: "#stories", label: t("stories") },
    { href: "#how-it-works", label: t("howItWorks") },
    { href: "#safety", label: t("safety") },
  ];

  return (
    <header className="py-4">
      <Container className="flex items-center justify-between gap-6">
        <Logo />
        <nav aria-label={t("label")} className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-body hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href={routes.signIn} variant="secondary">
            {tc("signIn")}
          </ButtonLink>
          <ButtonLink href={routes.signUp}>{tc("joinShort")}</ButtonLink>
        </div>
      </Container>
    </header>
  );
}
