import { Suspense, type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { AuthPanel } from "./AuthPanel";
import { GoogleButton } from "./GoogleButton";
import { GoogleErrorAlert } from "./GoogleErrorAlert";
import { DemoButton } from "./DemoButton";

type AuthCardProps = {
  title: string;
  subtitle: string;
  divider: string;
  form: ReactNode;
  footer: ReactNode;
};

// The shared skeleton of sign-in and sign-up: heading, Google, divider, the form, the demo option, and the switch link.
export async function AuthCard({ title, subtitle, divider, form, footer }: AuthCardProps) {
  const t = await getTranslations("auth");

  return (
    <AuthPanel title={title} subtitle={subtitle}>
      {/* Reads ?error= from the URL, which only exists in the browser; Suspense keeps the rest of the page static. */}
      <Suspense fallback={null}>
        <GoogleErrorAlert />
      </Suspense>

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
    </AuthPanel>
  );
}
