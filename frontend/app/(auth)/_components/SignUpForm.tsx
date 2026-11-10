"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";
import { useSignUp } from "@/hooks/auth/useSignUp";
import { routes } from "@/lib/routes";
import { checkEmail, checkNewPassword, checkPenName, PEN_NAME_MAX, PASSWORD_MAX, type AuthErrorKey } from "@/lib/validation/auth";
import { useFocusFirstError } from "./useFocusFirstError";

type Field = "penName" | "email" | "password";
type FieldErrors = Partial<Record<Field, AuthErrorKey>>;

const linkStyles = "font-semibold text-ink underline underline-offset-4 hover:text-primary-solid";

export function SignUpForm() {
  const t = useTranslations("auth");
  const { submit, loading, errorKey: formError } = useSignUp();
  const [values, setValues] = useState({ penName: "", email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempt, setAttempt] = useState(0);
  const formRef = useFocusFirstError(attempt);

  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear a field's error as soon as the person starts fixing it.
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: FieldErrors = {
      penName: checkPenName(values.penName) ?? undefined,
      email: checkEmail(values.email) ?? undefined,
      password: checkNewPassword(values.password) ?? undefined,
    };
    setErrors(next);
    if (next.penName || next.email || next.password) {
      setAttempt((n) => n + 1);
      return;
    }

    await submit({ penName: values.penName.trim(), email: values.email.trim(), password: values.password });
  }

  return (
    // noValidate: we show our own friendly messages instead of the browser's bubbles.
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {formError && (
        <FormAlert>
          {formError === "EMAIL_TAKEN"
            ? t.rich("errors.EMAIL_TAKEN", {
                link: (chunks) => (
                  <Link href={routes.signIn} className="font-semibold underline underline-offset-4">
                    {chunks}
                  </Link>
                ),
              })
            : t(`errors.${formError}`)}
        </FormAlert>
      )}

      <TextField
        id="penName"
        name="penName"
        label={t("fields.penName.label")}
        placeholder={t("fields.penName.placeholder")}
        hint={t("fields.penName.hint")}
        error={errors.penName ? t(`errors.${errors.penName}`) : null}
        value={values.penName}
        onChange={(e) => update("penName", e.target.value)}
        autoComplete="nickname"
        maxLength={PEN_NAME_MAX}
        required
      />
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
      <PasswordField
        id="password"
        name="password"
        label={t("fields.password.label")}
        hint={t("fields.password.hint")}
        error={errors.password ? t(`errors.${errors.password}`) : null}
        value={values.password}
        onChange={(e) => update("password", e.target.value)}
        // Tells password managers to suggest a new strong password here.
        autoComplete="new-password"
        maxLength={PASSWORD_MAX}
        showLabel={t("fields.password.show")}
        hideLabel={t("fields.password.hide")}
        required
      />

      <p className="text-center text-sm">
        {t.rich("signUp.terms", {
          terms: (chunks) => (
            <Link href={routes.terms} className={linkStyles}>
              {chunks}
            </Link>
          ),
          guidelines: (chunks) => (
            <Link href={routes.guidelines} className={linkStyles}>
              {chunks}
            </Link>
          ),
        })}
      </p>

      <Button type="submit" size="lg" className="w-full" loading={loading} loadingLabel={t("signUp.submitting")}>
        {t("signUp.submit")}
      </Button>
    </form>
  );
}
