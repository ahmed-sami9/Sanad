import type { ReactNode } from "react";

type AuthPanelProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

// On wider screens the content sits in a tonal panel (slightly darker than the page, no shadow) so it feels grounded.
// Inside the panel "muted" text is swapped for the body colour: plain muted grey drops below 4.5:1 contrast on the darker panel.
export function AuthPanel({ title, subtitle, children }: AuthPanelProps) {
  return (
    <div className="flex flex-col gap-6 lg:rounded-[2rem] lg:border lg:border-border lg:bg-panel lg:p-10 lg:[--color-muted:var(--color-body)]">
      <div className="flex flex-col gap-2">
        {/* Slightly smaller inside the panel so "Join the community" stays on one line. */}
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-[2.625rem]">{title}</h1>
        <p className="text-lg">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
