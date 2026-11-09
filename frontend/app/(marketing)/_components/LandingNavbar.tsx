import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Logo } from "@/components/ui/Logo";
import { routes } from "@/lib/routes";
import { MobileMenu } from "./MobileMenu";

export async function LandingNavbar() {
  const t = await getTranslations("landing.nav");
  const tc = await getTranslations("common");
  const tf = await getTranslations("landing.footer");

  // In-page anchors: each points at a section id further down the landing page.
  const links = [
    { href: "#communities", label: t("communities") },
    { href: "#stories", label: t("stories") },
    { href: "#how-it-works", label: t("howItWorks") },
    { href: "#safety", label: t("safety") },
  ];

  return (
    <header className="relative z-10 py-4">
      <Container className="flex items-center justify-between gap-6">
        <Logo />

        <nav aria-label={t("label")} className="hidden md:block">
          <ul className="flex items-center gap-6 lg:gap-9">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[15px] text-body transition-colors hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Desktop actions. Wrapped because a button's own inline-flex would override "hidden". */}
          <div className="hidden items-center gap-2 md:flex">
            <ButtonLink href={routes.signIn} variant="secondary">
              {tc("signIn")}
            </ButtonLink>
            <ButtonLink href={routes.signUp}>{tc("joinShort")}</ButtonLink>
          </div>

          {/* Phones: the menu owns its own Join button, so it can hide it while the menu is open. */}
          <MobileMenu
            links={links}
            join={{ href: routes.signUp, short: tc("joinShort"), full: tc("join") }}
            demo={{ href: routes.demo, label: tc("tryDemo") }}
            memberPrompt={t.rich("memberPrompt", {
              link: (chunks) => (
                <Link href={routes.signIn} className="font-semibold text-ink underline underline-offset-4 hover:text-primary-solid">
                  {chunks}
                </Link>
              ),
            })}
            tagline={tf("tagline")}
            openLabel={t("openMenu")}
            closeLabel={t("closeMenu")}
          />
        </div>
      </Container>
    </header>
  );
}
