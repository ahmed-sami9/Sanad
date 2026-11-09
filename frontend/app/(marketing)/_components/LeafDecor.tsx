import Image from "next/image";
import leafLeft from "@/public/images/landing/leaf-left.webp";
import leafRight from "@/public/images/landing/leaf-right.webp";

type LeafDecorProps = {
  variant: "left" | "right";
  // Mirrors the sprig so the same two images give four different silhouettes across sections.
  flip?: boolean;
  className?: string;
};

// Purely decorative: hidden from screen readers, ignores clicks, and only shown on wide screens.
export function LeafDecor({ variant, flip = false, className = "" }: LeafDecorProps) {
  return (
    <Image
      src={variant === "left" ? leafLeft : leafRight}
      alt=""
      aria-hidden="true"
      sizes="176px"
      className={`pointer-events-none absolute hidden h-auto select-none lg:block ${flip ? "-scale-x-100" : ""} ${className}`}
    />
  );
}
