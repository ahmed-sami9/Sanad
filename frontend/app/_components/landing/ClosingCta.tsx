import { getImageProps } from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { routes } from "@/lib/routes";
import ctaDesktop from "@/public/images/landing/cta-band.webp";
import ctaMobile from "@/public/images/landing/cta-band-mobile.webp";

export async function ClosingCta() {
  const t = await getTranslations("landing.cta");
  const tc = await getTranslations("common");

  // Art direction: a different image per screen shape, and the browser downloads only the one it shows.
  const common = { alt: "", sizes: "100vw" };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: ctaDesktop });
  const {
    props: { srcSet: mobileSrcSet, ...mobileImg },
  } = getImageProps({ ...common, src: ctaMobile });

  return (
    <section aria-labelledby="cta-title" className="py-16 md:py-24">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-cream/60">
          <picture>
            <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
            <source srcSet={mobileSrcSet} />
            <img
              {...mobileImg}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 size-full object-cover object-bottom"
            />
          </picture>

          <div className="flex flex-col items-center gap-4 px-6 pt-14 pb-40 text-center md:px-10 md:py-20">
            <h2 id="cta-title" className="font-serif text-4xl sm:text-5xl">
              {t("title")}
            </h2>
            <p className="text-lg">{t("subtitle")}</p>
            <div className="mt-3 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ButtonLink href={routes.signUp} size="lg">
                {tc("join")}
              </ButtonLink>
              <ButtonLink href={routes.demo} variant="secondary" size="lg">
                {tc("tryDemo")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
