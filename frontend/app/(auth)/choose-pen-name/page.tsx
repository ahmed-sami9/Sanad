import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { routes } from "@/lib/routes";
import { AuthPanel } from "../_components/AuthPanel";
import { PenNameForm } from "../_components/PenNameForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.choosePenName");
  // A step in a flow, not a page anyone should land on from search.
  return { title: t("metaTitle"), robots: { index: false } };
}

export default async function ChoosePenNamePage() {
  const t = await getTranslations("auth.choosePenName");

  return (
    <AuthPanel title={t("title")} subtitle={t("subtitle")}>
      <PenNameForm />
      <p className="text-center text-[15px]">
        {t.rich("switch", {
          link: (chunks) => (
            <Link href={routes.signIn} className="font-semibold text-ink underline underline-offset-4 hover:text-primary-solid">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </AuthPanel>
  );
}
