import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface MenuButtonProps extends React.ComponentProps<typeof Button> {
  showBadge?: boolean;
}

export default function MenuButton({
  showBadge = false,
  className,
  ...props
}: MenuButtonProps) {
  return (
    <span className="relative inline-flex">
      {showBadge && (
        <span className="absolute right-2 top-2 z-10 size-2 rounded-full bg-destructive" />
      )}
      <Button
        variant="ghost"
        size="icon"
        className={cn('rounded-full', className)}
        {...props}
      />
    </span>
  );
}
