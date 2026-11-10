"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { useStartDemo } from "@/hooks/auth/useStartDemo";

export function DemoButton() {
  const t = useTranslations("auth");
  const { start, loading, errorKey } = useStartDemo();

  return (
    <div className="flex flex-col gap-2">
      {/* "md" size keeps it visibly secondary to the main submit button. */}
      <Button type="button" variant="secondary" size="md" className="w-full" loading={loading} loadingLabel={t("demo.loading")} onClick={start}>
        {t("demo.label")}
      </Button>
      <p className="text-center text-xs text-muted">{t("demo.hint")}</p>
      {errorKey && <FormAlert>{t(`errors.${errorKey}`)}</FormAlert>}
    </div>
  );
}
