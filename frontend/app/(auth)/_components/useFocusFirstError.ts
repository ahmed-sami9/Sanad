"use client";

import { useEffect, useRef } from "react";

// After a failed submit, move keyboard focus to the first invalid field so nobody has to hunt for it.
export function useFocusFirstError(attempt: number) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (attempt === 0) return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [attempt]);

  return formRef;
}
