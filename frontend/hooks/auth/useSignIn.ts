"use client";

import { useRouter } from "next/navigation";
import { signIn } from "@/lib/api/auth";
import type { SignInInput } from "@/types/auth";
import { useApiAction } from "../useApiAction";
import { afterAuthPath } from "./afterAuthPath";

export function useSignIn() {
  const router = useRouter();
  const { run, loading, errorKey } = useApiAction(signIn);

  async function submit(input: SignInInput) {
    const result = await run(input);
    if (result) router.push(afterAuthPath());
  }

  return { submit, loading, errorKey };
}
