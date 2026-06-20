import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/utils';
import { useColorMode } from './AppTheme';

export default function ColorModeSelect(
  props: React.ComponentProps<typeof Button>,
) {
  const { mode, setMode } = useColorMode();
  const { t } = useI18n();

  const { className, ...buttonProps } = props;
  const modeLabels: Record<'system' | 'light' | 'dark', string> = {
    system: t('theme.system'),
    light: t('theme.light'),
    dark: t('theme.dark'),
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
            {t('theme.system')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <Sun className="mr-2 size-4" />
            {t('theme.light')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="mr-2 size-4" />
            {t('theme.dark')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
