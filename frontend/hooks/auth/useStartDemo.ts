"use client";

import { useRouter } from "next/navigation";
import { startDemo } from "@/lib/api/auth";
import { routes } from "@/lib/routes";
import { useApiAction } from "../useApiAction";

export function useStartDemo() {
  const router = useRouter();
  const { run, loading, errorKey } = useApiAction(startDemo);

  async function start() {
    const result = await run();
    // The demo always opens the app home; it isn't tied to a page the visitor came from.
    if (result) router.push(routes.app);
  }

  return { start, loading, errorKey };
}
