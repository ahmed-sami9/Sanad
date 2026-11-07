import Link from "next/link";
import { cacheLife } from "next/cache";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { routes } from "@/lib/routes";

// Cached so the static page doesn't need a fresh clock on every request; refreshed daily.
async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function LandingFooter() {
  const t = await getTranslations("landing.footer");
  const year = await currentYear();

  const links = [
    { href: routes.about, label: t("about") },
    { href: routes.guidelines, label: t("guidelines") },
    { href: routes.privacy, label: t("privacy") },
    { href: routes.contact, label: t("contact") },
  ];

  return (
    <footer className="border-t border-border pt-8 pb-10">
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <Logo />
            <span aria-hidden="true" className="hidden h-6 w-px bg-border sm:block" />
            <p className="text-sm">{t("tagline")}</p>
          </div>
          <nav aria-label={t("label")}>
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-11 items-center text-sm text-body hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="text-xs text-muted">{t("copyright", { year: String(year) })}</p>
      </Container>
    </footer>
  );
}
