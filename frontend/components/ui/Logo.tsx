import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { routes } from "@/lib/routes";

export function LeafMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path d="M6 27C6 13 15 5 27 5c0 12-8 22-21 22Z" fill="#7e9673" />
      <path d="M8 25c5-6 9-11 14-15" stroke="#faf3ea" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export async function Logo() {
  const t = await getTranslations("common");

  return (
    <Link href={routes.home} className="flex items-center gap-2 text-ink">
      <LeafMark className="size-8" />
      <span className="font-serif text-2xl">{t("brand")}</span>
    </Link>
  );
}
