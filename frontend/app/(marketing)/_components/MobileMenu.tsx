"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { buttonStyles } from "@/components/ui/buttonStyles";
import leafSprig from "@/public/images/landing/leaf-right.webp";

type MobileMenuProps = {
  links: { href: string; label: string }[];
  join: { href: string; short: string; full: string };
  demo: { href: string; label: string };
  memberPrompt: ReactNode;
  tagline: string;
  openLabel: string;
  closeLabel: string;
};

// The only client component on the landing page: it needs state for open/closed.
// Text arrives already translated from the server navbar, so no translations ship to the browser.
export function MobileMenu({ links, join, demo, memberPrompt, tagline, openLabel, closeLabel }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Stop the page behind the menu from scrolling while it's open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="flex items-center gap-2 md:hidden">
      {/* Hidden while the menu is open, so the menu's own Join is the only one on screen. */}
      {!open && (
        <Link href={join.href} className={buttonStyles("primary", "md")}>
          {join.short}
        </Link>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
        className="grid size-11 place-items-center rounded-full text-ink hover:bg-cream"
      >
        {open ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
      </button>

      {open && (
        <>
          {/* Covers the page below the header, so nothing underneath (like the hero buttons) shows through. */}
          <div aria-hidden="true" onClick={close} className="fixed inset-0 -z-10 bg-background/95 backdrop-blur-sm" />

          <div
            id={panelId}
            className="absolute inset-x-4 top-full mt-2 overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-lg shadow-ink/5"
          >
            {/* A sprig peeking in from the corner: the same watercolour touch as the rest of the page. */}
            <Image
              src={leafSprig}
              alt=""
              aria-hidden="true"
              sizes="112px"
              className="pointer-events-none absolute -end-6 -top-6 h-auto w-28 rotate-[24deg] opacity-60 select-none"
            />

            <ul className="relative flex flex-col">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={close} className="flex min-h-12 items-center rounded-xl px-3 text-base text-ink hover:bg-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="relative mt-3 flex flex-col gap-2 border-t border-border pt-4">
              <Link href={join.href} onClick={close} className={`${buttonStyles("primary", "lg")} w-full`}>
                {join.full}
              </Link>
              <Link href={demo.href} onClick={close} className={`${buttonStyles("secondary", "lg")} w-full`}>
                {demo.label}
              </Link>
              <p className="mt-2 text-center text-sm text-body">{memberPrompt}</p>
            </div>

            <p className="relative mt-4 text-center font-serif text-sm text-muted italic">{tagline}</p>
          </div>
        </>
      )}
    </div>
  );
}
