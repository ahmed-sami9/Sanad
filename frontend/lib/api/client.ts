// Shared request helper for every call to the Express API (used once real endpoints exist).
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");

  const response = await fetch(`${API_URL}/api/v1${path}`, {
    ...init,
    // Sends the auth cookie to the API, which lives on a different origin.
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init.headers },
  });

  if (!response.ok) {
    // The backend always answers errors as { code, message }; fall back if it didn't.
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body?.code ?? "UNKNOWN_ERROR", body?.message ?? response.statusText);
  }

  return response.json() as Promise<T>;
}
