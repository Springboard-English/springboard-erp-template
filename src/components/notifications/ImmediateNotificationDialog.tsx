import { AlertTriangle } from "lucide-react";
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
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <DialogPrimitive.Content
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                    className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                    aria-describedby={current.description ? "immediate-desc" : undefined}
                >
                    {/* Red header band */}
                    <div className="relative overflow-hidden bg-destructive px-6 pb-8 pt-6">
                        <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/10" />
                        <div className="pointer-events-none absolute -bottom-6 -left-4 size-28 rounded-full bg-black/10" />
                        <div className="relative flex items-start gap-3">
                            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                                <AlertTriangle className="size-5 text-white" />
                            </span>
                            <div className="min-w-0">
                                {immediate.length > 1 && (
                                    <p className="mb-1 text-xs font-medium text-white/60">
                                        {immediate.length} urgent messages
                                    </p>
                                )}
                                <DialogPrimitive.Title className="text-lg font-bold leading-snug text-white">
                                    {current.title}
                                </DialogPrimitive.Title>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5">
                        {current.description ? (
                            <p id="immediate-desc" className="text-sm leading-relaxed text-foreground">
                                {current.description}
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Please acknowledge this notification to continue.
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end border-t border-border/60 px-6 py-4">
                        <Button
                            variant="destructive"
                            onClick={() => dismiss(current.appsheet_key)}
                        >
                            Acknowledge
                        </Button>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
