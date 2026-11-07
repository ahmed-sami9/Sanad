import { getTranslations } from "next-intl/server";
import { ShieldUser, Sprout, TriangleAlert, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";

type ItemKey = "penName" | "experience" | "report" | "visibility";

const items: { key: ItemKey; icon: LucideIcon }[] = [
  { key: "penName", icon: ShieldUser },
  { key: "experience", icon: Sprout },
  { key: "report", icon: TriangleAlert },
  { key: "visibility", icon: SlidersHorizontal },
];

export async function SafetyBand() {
  const t = await getTranslations("landing.safety");

  return (
    <section id="safety" aria-labelledby="safety-title" className="bg-forest py-16 text-on-dark md:py-20">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-gold-light">{t("eyebrow")}</p>
          <h2 id="safety-title" className="font-serif text-4xl text-on-dark sm:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-on-dark-muted">{t("subtitle")}</p>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {items.map(({ key, icon: Icon }, index) => (
            <li key={key} className={`flex items-start gap-4 lg:px-6 ${index > 0 ? "lg:border-s lg:border-on-dark/20" : ""}`}>
              <Icon aria-hidden="true" className="size-9 shrink-0 text-on-dark" strokeWidth={1.4} />
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-on-dark">{t(`${key}.title`)}</h3>
                <p className="text-sm leading-relaxed text-on-dark-muted">{t(`${key}.body`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
