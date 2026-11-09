import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { routes } from "@/lib/routes";
import { AuthCard } from "../_components/AuthCard";
import { SignUpForm } from "../_components/SignUpForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.signUp");
  return { title: t("metaTitle") };
}

export default async function SignUpPage() {
  const t = await getTranslations("auth.signUp");

  return (
    <AuthCard
      title={t("title")}
      subtitle={t("subtitle")}
      divider={t("divider")}
      form={<SignUpForm />}
      footer={t.rich("switch", {
        link: (chunks) => (
          <Link href={routes.signIn} className="font-semibold text-ink underline underline-offset-4 hover:text-primary-solid">
            {chunks}
          </Link>
        ),
      })}
    />
  );
}
