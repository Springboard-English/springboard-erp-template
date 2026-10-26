import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { UserInfo } from "../api_calls/UserData";

export interface UserAvatarProps {
  /** The person shown; null while they load, which shows "?". */
  user: Pick<UserInfo, "name" | "picture_url"> | null | undefined;
  className?: string;
  /** Classes for the initials, e.g. a larger text size on a larger avatar. */
  fallbackClassName?: string;
}

/** Up to two initials from a name, "?" for none: "Nguyen Van An" gives "NV". */
export function userInitials(name: string | null | undefined): string {
  if (!name) {
    return "?";
  }
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return initials || "?";
}

/**
 * A person's profile picture in a circle, or their initials when they have
 * none. A URL that does not load (a picture since replaced, or offline) also
 * falls back to the initials.
 */
export default function UserAvatar({ user, className, fallbackClassName }: UserAvatarProps) {
  const name = user?.name ?? null;
  const src = user?.picture_url || undefined;
  return (
    <Avatar className={cn("size-10", className)}>
      {/* Decorative: the name is always printed next to it or in a title. */}
      {src ? <AvatarImage src={src} alt="" className="object-cover" /> : null}
      <AvatarFallback
        className={cn("font-semibold tracking-tight text-foreground", fallbackClassName)}
      >
        {userInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
