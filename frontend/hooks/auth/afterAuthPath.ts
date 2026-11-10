import { routes } from "@/lib/routes";
import { safeNextPath } from "@/lib/safeNextPath";

// Where to go after signing in or up: the page the person came from (?next=...), if it is on this site.
export function afterAuthPath(): string {
  return safeNextPath(new URLSearchParams(window.location.search).get("next"), routes.app);
}
