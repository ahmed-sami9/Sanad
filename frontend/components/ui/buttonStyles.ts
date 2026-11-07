export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary-solid text-on-solid hover:bg-primary-hover",
  secondary: "border border-border bg-surface text-ink hover:border-olive-ink",
  ghost: "text-ink hover:text-primary-solid",
};

// min-h-11 keeps every button at least 44px tall, the minimum comfortable touch target.
const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-7 text-base",
};

// Shared by ButtonLink now and a <button> component later, so both always look the same.
export function buttonStyles(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}
