import Image from "next/image";

type AvatarProps = {
  name: string;
  src: string | null;
  size?: number;
  className?: string;
};

// Users go by pen names and may have no picture, so initials are the fallback, not an error state.
export function Avatar({ name, src, size = 40, className = "" }: AvatarProps) {
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-sage-tint text-sm font-bold text-ink ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt="" width={size} height={size} className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  );
}
