import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { routes } from "@/lib/routes";
import friendsImage from "@/public/images/auth/friends.webp";
import friendsBand from "@/public/images/auth/friends-band.webp";
import meadow from "@/public/images/auth/meadow.webp";

// Shared by /sign-in and /sign-up. A layout stays mounted between its pages,
// so switching forms swaps only the right side and the illustration never reloads.
export default async function AuthLayout({ children }: LayoutProps<"/">) {
  const t = await getTranslations("auth");

  return (
    // relative isolate: the meadow below is positioned against this wrapper and kept behind its content (-z-10).
    <div className="relative isolate flex min-h-screen flex-col">
      {/* relative z-10: keeps the logo and back link above the illustration when it is pulled up beside them. */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <Link
          href={routes.home}
          className="inline-flex min-h-11 items-center gap-2 text-[15px] text-body hover:text-ink"
        >
          {/* Arrow points "back", so it mirrors in right-to-left languages. */}
          <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          {/* On phones only the arrow shows; the label stays for screen readers. */}
          <span className="sr-only sm:not-sr-only">{t("backHome")}</span>
        </Link>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-6 px-4 pb-24 sm:px-6 lg:pb-16 lg:grid-cols-[1fr_minmax(0,32rem)] lg:gap-12 lg:px-8">
        {/* Phones and tablets: a short band around the two faces, so the form is reached without scrolling past a picture.
            Two columns start at laptop width (lg); on a tablet the side image would be squeezed to a thumbnail. */}
        <Image
          src={friendsBand}
          alt={t("imageAlt")}
          preload
          sizes="100vw"
          className="-mx-4 h-auto w-[calc(100%+2rem)] max-w-none sm:-mx-6 sm:w-[calc(100%+3rem)] lg:hidden"
        />
        {/* Laptops and up: the full portrait illustration beside the form, centred on it. Slightly wider than its
            column (it fades at the edges) and lifted 4% to sit at the optical centre, which reads as centred to the eye. */}
        <Image
          src={friendsImage}
          alt={t("imageAlt")}
          sizes="50vw"
          className="hidden h-auto w-[112%] max-w-none -translate-y-[4%] justify-self-center lg:block"
        />

        {/* On tablets the form stays at a comfortable reading width instead of stretching across the screen. */}
        <div className="mx-auto w-full max-w-lg lg:max-w-none">{children}</div>
      </main>

      {/* A watercolour meadow behind the bottom of the page, full width at its natural shape: it gives the page
          a "ground", fills the empty sides on wide screens, and its faded top rises softly behind the content.
          min-h keeps the flowers visible on phones (the sides get cropped instead). Its height grows with the screen width,
          so it's capped at 27rem (it stops growing beyond ~1950px wide), and its top 15% fades out with a mask so the
          tallest leaf tips dissolve instead of being sliced off. The illustration's pale base is see-through, so where the
          meadow passes behind it the two blend into one meadow. */}
      <Image
        src={meadow}
        alt=""
        aria-hidden="true"
        sizes="100vw"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-auto max-h-[27rem] min-h-40 w-full object-cover object-bottom select-none [mask-image:linear-gradient(to_top,black_85%,transparent)]"
      />

      <footer className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Body colour, not muted: the text sits on the meadow's soft haze, where muted grey is too faint. */}
        <p className="py-5 text-center text-sm text-body">{t("footer")}</p>
      </footer>
    </div>
  );
}
