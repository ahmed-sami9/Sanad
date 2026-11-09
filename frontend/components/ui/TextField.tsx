import type { InputHTMLAttributes, ReactNode } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  // Extra content inside the input box, e.g. the show/hide password button.
  trailing?: ReactNode;
};

export const fieldInputStyles =
  "min-h-12 w-full rounded-xl border bg-surface px-4 text-base text-ink placeholder:text-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid/40";

// Label above, hint or error below, all linked with aria attributes so screen readers announce them with the field.
export function TextField({ id, label, hint, error, trailing, className = "", ...inputProps }: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
          className={`${fieldInputStyles} ${error ? "border-danger" : "border-border hover:border-olive-ink"} ${trailing ? "pe-12" : ""} ${className}`}
          {...inputProps}
        />
        {trailing && <div className="absolute inset-y-0 end-1 flex items-center">{trailing}</div>}
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-sm text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
