import type { ButtonHTMLAttributes } from "react";
import { buttonStyles, type ButtonSize, type ButtonVariant } from "./buttonStyles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
};

// A real <button>, styled exactly like ButtonLink. While loading it is disabled, so a form can't be sent twice.
export function Button({ variant, size, loading = false, loadingLabel, disabled, className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`${buttonStyles(variant, size)} disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-e-transparent motion-reduce:animate-none" />
      )}
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
}
