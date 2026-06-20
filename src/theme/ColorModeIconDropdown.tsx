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
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/utils';
import { useColorMode } from './AppTheme';

export default function ColorModeIconDropdown(
  props: React.ComponentProps<typeof Button>,
) {
  const { mode, systemMode, setMode } = useColorMode();
  const { t } = useI18n();
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
          aria-label={t('theme.toggle')}
          {...buttonProps}
        >
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{t('theme.appearance')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
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
