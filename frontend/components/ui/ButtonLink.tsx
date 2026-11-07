import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonStyles, type ButtonSize, type ButtonVariant } from "./buttonStyles";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

// A link that looks like a button: navigation stays a real <a> for accessibility and prefetching.
export function ButtonLink({ variant, size, className = "", ...props }: ButtonLinkProps) {
  return <Link className={`${buttonStyles(variant, size)} ${className}`} {...props} />;
}
