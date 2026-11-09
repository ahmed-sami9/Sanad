import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { GoogleButton } from "./GoogleButton";
import { DemoButton } from "./DemoButton";

type AuthCardProps = {
  title: string;
  subtitle: string;
  divider: string;
  form: ReactNode;
  footer: ReactNode;
};

// The shared skeleton of both pages: heading, Google, divider, the form, the demo option, and the switch link.
// On wider screens it sits in a tonal panel (slightly darker than the page, no shadow) so the form feels grounded.
// Inside the panel "muted" text is swapped for the body colour: plain muted grey drops below 4.5:1 contrast on the darker panel.
export async function AuthCard({ title, subtitle, divider, form, footer }: AuthCardProps) {
  const t = await getTranslations("auth");

  return (
    <div className="flex flex-col gap-6 lg:rounded-[2rem] lg:border lg:border-border lg:bg-panel lg:p-10 lg:[--color-muted:var(--color-body)]">
      <div className="flex flex-col gap-2">
        {/* Slightly smaller inside the panel so "Join the community" stays on one line. */}
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-[2.625rem]">{title}</h1>
        <p className="text-lg">{subtitle}</p>
      </div>

      <GoogleButton label={t("google")} />

      <div className="flex items-center gap-4 text-sm text-muted" role="separator" aria-label={divider}>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        <span aria-hidden="true">{divider}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>

      {form}

      <div className="flex items-center gap-4 text-sm text-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        {t("or")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <DemoButton />

      <p className="text-center text-[15px]">{footer}</p>
    </div>
  );
}
