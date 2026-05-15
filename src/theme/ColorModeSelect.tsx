import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useColorMode } from './AppTheme';

export default function ColorModeSelect(
  props: React.ComponentProps<typeof Button>,
) {
  const { mode, setMode } = useColorMode();

  const { className, ...buttonProps } = props;
  const modeLabels: Record<'system' | 'light' | 'dark', string> = {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
  };
  const modeIcons = {
    system: <Monitor className="size-4" />,
    light: <Sun className="size-4" />,
    dark: <Moon className="size-4" />,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-screenshot="toggle-mode"
          variant="outline"
          size="sm"
          className={cn(
            'rounded-full border-border/70 bg-background/85 px-3 shadow-sm backdrop-blur',
            className,
          )}
          {...buttonProps}
        >
          {modeIcons[mode]}
          <span className="hidden sm:inline">{modeLabels[mode]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
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
