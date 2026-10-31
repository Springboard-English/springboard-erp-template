import type { ComponentProps } from "react";
import { Languages } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { headerIconButton } from "@/lib/headerControl";
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
          variant="ghost"
          size="sm"
          // The header toolbar's ghost circle, stretched to fit a short language code; the menu names each language in full.
          className={cn(headerIconButton, "gap-1 px-2.5 text-xs font-semibold", className)}
          aria-label={t("locale.openSelector")}
          title={getLocaleLabel(locale)}
          {...buttonProps}
        >
          <Languages className="size-4" />
          <span className="hidden sm:inline">{locale.toUpperCase()}</span>
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
