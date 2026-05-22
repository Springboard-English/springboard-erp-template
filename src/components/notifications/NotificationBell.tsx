import { useState } from "react";
import { Bell, RefreshCw, X } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationBell() {
    const { informative, unreadCount, isLoading, dismiss, refetch } = useNotifications();
    const [open, setOpen] = useState(false);

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen && informative.length > 0) {
            informative.forEach((n) => dismiss(n.appsheet_key));
        }
        setOpen(nextOpen);
    };

    return (
        <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
            <PopoverPrimitive.Trigger asChild>
                <button
                    type="button"
                    className="relative flex h-8 w-8 items-center justify-center rounded-md border border-border/70 bg-muted/45 text-foreground transition-colors hover:bg-muted"
                    aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                >
                    <Bell className="size-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                    align="end"
                    sideOffset={8}
                    className={cn(
                        "z-50 w-80 rounded-xl border border-border/70 bg-popover shadow-lg outline-none",
                        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2",
                        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2",
                        "duration-150",
                    )}
                >
                    <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                        <p className="text-sm font-semibold text-foreground">Notifications</p>
                        <div className="flex items-center gap-2">
                            {informative.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        informative.forEach((n) => dismiss(n.appsheet_key));
                                        setOpen(false);
                                    }}
                                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Clear all
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={refetch}
                                disabled={isLoading}
                                className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                                aria-label="Refresh notifications"
                            >
                                <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
                            </button>
                        </div>
                    </div>

                    {informative.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No new notifications
                        </div>
                    ) : (
                        <ul className="max-h-80 divide-y divide-border/50 overflow-y-auto">
                            {informative.map((n) => (
                                <li key={n.appsheet_key} className="flex items-start gap-3 px-4 py-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium leading-snug text-foreground">
                                            {n.title}
                                        </p>
                                        {n.description && (
                                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                                {n.description}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => dismiss(n.appsheet_key)}
                                        className="mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                                        aria-label="Dismiss"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
}
