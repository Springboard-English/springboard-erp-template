import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-3 py-1 text-xs font-extrabold whitespace-nowrap shadow-xs transition-transform duration-200 ease-bounce focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3.5 [a&]:cursor-pointer [a&]:hover:-translate-y-0.5 [a&]:hover:scale-[1.04]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_3px_8px_rgba(33,27,30,.16)] [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-error-bg text-error shadow-none focus-visible:ring-destructive/20 [a&]:hover:bg-error-bg/80",
        outline:
          "border-2 border-border bg-transparent text-foreground shadow-none [a&]:hover:border-rose-300 [a&]:hover:text-primary",
        ghost: "bg-muted text-muted-foreground shadow-none [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        mono: "rounded-[10px] border border-border bg-muted px-2.5 py-1.5 font-mono text-[11px] font-bold tracking-normal text-muted-foreground normal-case shadow-none",
        link: "border-0 bg-transparent p-0 text-primary underline-offset-4 shadow-none [a&]:hover:translate-y-0 [a&]:hover:scale-100 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
