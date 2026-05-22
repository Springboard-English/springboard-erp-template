import { Bell } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";

export default function ImmediateNotificationDialog() {
    const { immediate, dismiss } = useNotifications();
    const current = immediate[0] ?? null;

    if (!current) return null;

    return (
        <DialogPrimitive.Root open>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <DialogPrimitive.Content
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                    className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                    aria-describedby={current.description ? "immediate-desc" : undefined}
                >
                    <div className="flex flex-col items-center px-8 py-10 text-center">
                        <span className="mb-5 flex size-10 items-center justify-center rounded-full bg-muted ring-1 ring-border">
                            <Bell className="size-4 text-foreground" />
                        </span>

                        {immediate.length > 1 && (
                            <p className="mb-1 text-xs text-muted-foreground">
                                {immediate.length} notices
                            </p>
                        )}

                        <DialogPrimitive.Title className="text-lg font-semibold leading-snug text-foreground">
                            {current.title}
                        </DialogPrimitive.Title>

                        {current.description && (
                            <p id="immediate-desc" className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {current.description}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center border-t border-border/60 px-6 py-4">
                        <Button onClick={() => dismiss(current.appsheet_key)}>
                            Acknowledge
                        </Button>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
