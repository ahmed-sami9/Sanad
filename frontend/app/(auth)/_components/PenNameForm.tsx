"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { TextField } from "@/components/ui/TextField";
import { useCompleteGoogleSignUp } from "@/hooks/auth/useCompleteGoogleSignUp";
import { routes } from "@/lib/routes";
import { checkPenName, PEN_NAME_MAX, type AuthErrorKey } from "@/lib/validation/auth";
import { useFocusFirstError } from "./useFocusFirstError";

const alertLink = "font-semibold underline underline-offset-4";

export function PenNameForm() {
  const t = useTranslations("auth");
  const { submit, loading, errorKey: formError } = useCompleteGoogleSignUp();
  const [penName, setPenName] = useState("");
  const [error, setError] = useState<AuthErrorKey | null>(null);
  const [attempt, setAttempt] = useState(0);
  const formRef = useFocusFirstError(attempt);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = checkPenName(penName);
    setError(problem);
    if (problem) {
      setAttempt((n) => n + 1);
      return;
    }
    await submit({ penName: penName.trim() });
  }

  function renderFormError() {
    if (formError === "GOOGLE_SIGNUP_EXPIRED") {
      return t.rich("errors.GOOGLE_SIGNUP_EXPIRED", {
        link: (chunks) => (
          <Link href={routes.signUp} className={alertLink}>
            {chunks}
          </Link>
        ),
      });
    }
    if (formError === "EMAIL_TAKEN") {
      return t.rich("errors.EMAIL_TAKEN", {
        link: (chunks) => (
          <Link href={routes.signIn} className={alertLink}>
            {chunks}
          </Link>
        ),
      });
    }
    return formError ? t(`errors.${formError}`) : null;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {formError && <FormAlert>{renderFormError()}</FormAlert>}

      <TextField
        id="penName"
        name="penName"
        label={t("fields.penName.label")}
        placeholder={t("fields.penName.placeholder")}
        hint={t("fields.penName.hint")}
        error={error ? t(`errors.${error}`) : null}
        value={penName}
        onChange={(e) => {
          setPenName(e.target.value);
          if (error) setError(null);
        }}
        autoComplete="nickname"
        maxLength={PEN_NAME_MAX}
        autoFocus
        required
      />

      <Button type="submit" size="lg" className="w-full" loading={loading} loadingLabel={t("choosePenName.submitting")}>
        {t("choosePenName.submit")}
      </Button>
    </form>
  );
}
