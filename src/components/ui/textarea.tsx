import * as React from 'react';
import { cn } from '@/lib/utils';
import { uiPresetClass } from '@/config/uiPreset';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  const presetClass = uiPresetClass('textarea');

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // `field-sizing-content` grows the box with what is typed instead of
        // making the user drag a resize handle, and `text-base md:text-sm`
        // keeps the mobile font at 16px so iOS does not zoom on focus — the
        // same rule Input follows. Both adopted from Leap's fork.
        'flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        presetClass,
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
