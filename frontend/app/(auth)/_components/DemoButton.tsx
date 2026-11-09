"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { ApiError } from "@/lib/api/client";
import { startDemo } from "@/lib/api/auth";
import { routes } from "@/lib/routes";
import { errorKeyFor, type ApiErrorKey } from "./errorKey";

export function DemoButton() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorKey | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      await startDemo();
      router.push(routes.app);
    } catch (err) {
      setError(errorKeyFor(err instanceof ApiError ? err.code : null));
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* "md" size keeps it visibly secondary to the main submit button. */}
      <Button type="button" variant="secondary" size="md" className="w-full" loading={loading} loadingLabel={t("demo.loading")} onClick={handleClick}>
        {t("demo.label")}
      </Button>
      <p className="text-center text-xs text-muted">{t("demo.hint")}</p>
      {error && <FormAlert>{t(`errors.${error}`)}</FormAlert>}
    </div>
  );
}
