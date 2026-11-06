import { ArrowRight } from "lucide-react";

// Points "forward" in both directions: mirrored automatically in right-to-left languages.
export function DirectionalArrow({ className = "" }: { className?: string }) {
  return <ArrowRight aria-hidden="true" className={`size-4 rtl:-scale-x-100 ${className}`} strokeWidth={1.75} />;
}
