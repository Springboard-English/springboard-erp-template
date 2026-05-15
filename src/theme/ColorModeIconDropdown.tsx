import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useColorMode } from './AppTheme';

export default function ColorModeIconDropdown(
  props: React.ComponentProps<typeof Button>,
) {
  const { mode, systemMode, setMode } = useColorMode();
  const { className, ...buttonProps } = props;

  const resolvedMode = (systemMode || mode) as 'light' | 'dark';
  const icon = resolvedMode === 'light'
    ? <Sun className="size-4" />
    : <Moon className="size-4" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-screenshot="toggle-mode"
          variant="ghost"
          size="icon"
          className={cn('rounded-full', className)}
          aria-label="Toggle color mode"
          {...buttonProps}
        >
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={mode}
          onValueChange={(value) => setMode(value as 'system' | 'light' | 'dark')}
        >
          <DropdownMenuRadioItem value="system">
            <Monitor className="mr-2 size-4" />
            System
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <Sun className="mr-2 size-4" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="mr-2 size-4" />
            Dark
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
