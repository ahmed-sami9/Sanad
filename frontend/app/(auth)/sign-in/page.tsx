import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { routes } from "@/lib/routes";
import { AuthCard } from "../_components/AuthCard";
import { SignInForm } from "../_components/SignInForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.signIn");
  return { title: t("metaTitle") };
}

export default async function SignInPage() {
  const t = await getTranslations("auth.signIn");

  return (
    <AuthCard
      title={t("title")}
      subtitle={t("subtitle")}
      divider={t("divider")}
      form={<SignInForm />}
      footer={t.rich("switch", {
        link: (chunks) => (
          <Link href={routes.signUp} className="font-semibold text-ink underline underline-offset-4 hover:text-primary-solid">
            {chunks}
          </Link>
        ),
      })}
    />
  );
}
