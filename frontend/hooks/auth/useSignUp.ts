"use client";

import { useRouter } from "next/navigation";
import { signUp } from "@/lib/api/auth";
import type { SignUpInput } from "@/types/auth";
import { useApiAction } from "../useApiAction";
import { afterAuthPath } from "./afterAuthPath";

export function useSignUp() {
  const router = useRouter();
  const { run, loading, errorKey } = useApiAction(signUp);

  async function submit(input: SignUpInput) {
    const result = await run(input);
    if (result) router.push(afterAuthPath());
  }

  return { submit, loading, errorKey };
}
