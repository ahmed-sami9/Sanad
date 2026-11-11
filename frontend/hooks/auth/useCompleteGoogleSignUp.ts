"use client";

import { useRouter } from "next/navigation";
import { completeGoogleSignUp } from "@/lib/api/auth";
import { routes } from "@/lib/routes";
import type { GoogleSignUpInput } from "@/types/auth";
import { useApiAction } from "../useApiAction";

export function useCompleteGoogleSignUp() {
  const router = useRouter();
  const { run, loading, errorKey } = useApiAction(completeGoogleSignUp);

  async function submit(input: GoogleSignUpInput) {
    const result = await run(input);
    if (result) router.push(routes.app);
  }

  return { submit, loading, errorKey };
}
