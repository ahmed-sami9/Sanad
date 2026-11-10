"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { errorKeyFor, type ApiErrorKey } from "@/lib/api/errorKey";

// Wraps one API call with the state every write needs: loading, and a translated error key on failure.
// Returns null on failure so the caller can simply check `if (result)`.
export function useApiAction<TArgs extends unknown[], TResult>(action: (...args: TArgs) => Promise<TResult>) {
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<ApiErrorKey | null>(null);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      setLoading(true);
      setErrorKey(null);
      try {
        // On success loading stays true: the caller usually navigates away, and the button must not re-enable meanwhile.
        return await action(...args);
      } catch (err) {
        setErrorKey(errorKeyFor(err instanceof ApiError ? err.code : null));
        setLoading(false);
        return null;
      }
    },
    [action],
  );

  return { run, loading, errorKey };
}
