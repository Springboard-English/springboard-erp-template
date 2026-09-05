import type { ComponentProps } from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";

type LocaleSelectProps = ComponentProps<typeof Button> & {
  localeLabels?: Record<string, string>;
};

export default function LocaleSelect(props: LocaleSelectProps) {
  const { locale, setLocale, availableLocales, t } = useI18n();
  const { className, localeLabels, ...buttonProps } = props;

  const getLocaleLabel = (localeCode: string) => {
    if (localeLabels?.[localeCode]) {
      return localeLabels[localeCode];
    }

    if (localeCode === "en") {
      return t("locale.en");
    }

    if (localeCode === "vi") {
      return t("locale.vi");
    }

    return localeCode.toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full border-border/70 bg-background/85 px-3 shadow-sm backdrop-blur",
            className,
          )}
          aria-label={t("locale.openSelector")}
          {...buttonProps}
        >
          <Languages className="size-4" />
          <span className="hidden sm:inline">{getLocaleLabel(locale)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup value={locale} onValueChange={setLocale}>
          {availableLocales.map((localeCode) => (
            <DropdownMenuRadioItem key={localeCode} value={localeCode}>
              {getLocaleLabel(localeCode)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
