"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";
import { ApiError } from "@/lib/api/client";
import { signIn } from "@/lib/api/auth";
import { routes } from "@/lib/routes";
import { safeNextPath } from "@/lib/safeNextPath";
import { checkEmail, checkExistingPassword, type AuthErrorKey } from "@/lib/validation/auth";
import { errorKeyFor, type ApiErrorKey } from "./errorKey";
import { useFocusFirstError } from "./useFocusFirstError";

type Field = "email" | "password";
type FieldErrors = Partial<Record<Field, AuthErrorKey>>;

export function SignInForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<ApiErrorKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const formRef = useFocusFirstError(attempt);

  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    // Sign-in only checks that something sensible was typed; password rules are a sign-up concern.
    const next: FieldErrors = {
      email: checkEmail(values.email) ?? undefined,
      password: checkExistingPassword(values.password) ?? undefined,
    };
    setErrors(next);
    if (next.email || next.password) {
      setAttempt((n) => n + 1);
      return;
    }

    setLoading(true);
    try {
      await signIn({ email: values.email.trim(), password: values.password });
      router.push(safeNextPath(new URLSearchParams(window.location.search).get("next"), routes.app));
    } catch (err) {
      setFormError(errorKeyFor(err instanceof ApiError ? err.code : null));
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {formError && <FormAlert>{t(`errors.${formError}`)}</FormAlert>}

      <TextField
        id="email"
        name="email"
        type="email"
        label={t("fields.email.label")}
        placeholder={t("fields.email.placeholder")}
        error={errors.email ? t(`errors.${errors.email}`) : null}
        value={values.email}
        onChange={(e) => update("email", e.target.value)}
        autoComplete="email"
        inputMode="email"
        spellCheck={false}
        required
      />
      <div className="flex flex-col gap-2">
        <PasswordField
          id="password"
          name="password"
          label={t("fields.password.label")}
          error={errors.password ? t(`errors.${errors.password}`) : null}
          value={values.password}
          onChange={(e) => update("password", e.target.value)}
          // Tells password managers to fill the saved password here.
          autoComplete="current-password"
          showLabel={t("fields.password.show")}
          hideLabel={t("fields.password.hide")}
          required
        />
        <Link href={routes.forgotPassword} className="self-end text-sm font-semibold text-ink underline underline-offset-4 hover:text-primary-solid">
          {t("signIn.forgot")}
        </Link>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={loading} loadingLabel={t("signIn.submitting")}>
        {t("signIn.submit")}
      </Button>
    </form>
  );
}
