import { getTranslations } from "next-intl/server";
import { CalendarCheck, PenLine, UsersRound, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LeafDecor } from "./LeafDecor";

type StepKey = "checkIn" | "share" | "circle";

const steps: { key: StepKey; icon: LucideIcon }[] = [
  { key: "checkIn", icon: CalendarCheck },
  { key: "share", icon: PenLine },
  { key: "circle", icon: UsersRound },
];

export async function HowItWorks() {
  const t = await getTranslations("landing.howItWorks");

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="relative overflow-x-clip py-16 md:py-24">
      {/* Deliberately uneven (size, height, angle) and partly off-screen, so they read as growing in, not placed. */}
      <LeafDecor variant="left" className="-start-8 top-12 w-40 -rotate-[18deg] opacity-85" />
      <LeafDecor variant="right" className="-end-4 top-0 w-32 rotate-[8deg] opacity-75" />

      <Container>
        <h2 id="how-it-works-title" className="text-center font-serif text-4xl sm:text-5xl">
          {t("title")}
        </h2>

        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0">
          {steps.map(({ key, icon: Icon }, index) => (
            <li
              key={key}
              className={`flex items-start gap-4 md:px-8 ${index > 0 ? "md:border-s md:border-border" : ""}`}
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-sage-tint">
                <Icon aria-hidden="true" className="size-6 text-olive-ink" strokeWidth={1.6} />
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-bold">{t(`${key}.title`)}</h3>
                <p className="leading-relaxed">{t.rich(`${key}.body`, { em: (chunks) => <em>{chunks}</em> })}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
