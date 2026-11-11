"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FormAlert } from "@/components/ui/FormAlert";
import { errorKeyFor } from "@/lib/api/errorKey";

// The Google flow ends with a redirect, so its errors arrive as ?error=CODE instead of an API response.
export function GoogleErrorAlert() {
  const t = useTranslations("auth.errors");
  const code = useSearchParams().get("error");
  if (!code) return null;

  const key = errorKeyFor(code);
  // GOOGLE_SIGNUP_EXPIRED is only shown on the pen-name page, which has its own link.
  return <FormAlert>{key === "GOOGLE_SIGNUP_EXPIRED" ? t("GOOGLE_FAILED") : t(key)}</FormAlert>;
}
