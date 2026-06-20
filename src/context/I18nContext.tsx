import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next, useTranslation } from "react-i18next";
import { ENGLISH_MESSAGES, type TemplateI18nKey } from "@/i18n/messages";

export type TemplateMessages = Partial<Record<TemplateI18nKey | string, string>>;
export type TemplateLocaleResources = Record<string, TemplateMessages>;

type TranslationValues = Record<string, string | number>;

function createI18nInstance(locale: string, messagesByLocale?: TemplateLocaleResources) {
  const instance = createInstance();
  const resources = Object.entries(messagesByLocale ?? {}).reduce<Record<string, { translation: TemplateMessages }>>(
    (acc, [resourceLocale, resourceMessages]) => {
      acc[resourceLocale] = {
        translation: resourceLocale === "en"
          ? { ...ENGLISH_MESSAGES, ...resourceMessages }
          : resourceMessages,
      };
      return acc;
    },
    {
      en: {
        translation: ENGLISH_MESSAGES,
      },
    },
  );

  if (!resources[locale]) {
    resources[locale] = {
      translation: locale === "en" ? ENGLISH_MESSAGES : {},
    };
  }

  void instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources,
  });

  return instance;
}

type I18nContextValue = {
  locale: string;
  setLocale: (locale: string) => void;
  availableLocales: string[];
};

const TemplateI18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  locale,
  defaultLocale = "en",
  messages,
  messagesByLocale,
  storageKey,
}: {
  children: ReactNode;
  locale?: string;
  messages?: TemplateMessages;
  defaultLocale?: string;
  messagesByLocale?: TemplateLocaleResources;
  storageKey?: string;
}) {
  const initialLocale = locale ?? (
    typeof window !== "undefined" && storageKey
      ? window.localStorage.getItem(storageKey)?.trim() || defaultLocale
      : defaultLocale
  );
  const [activeLocale, setActiveLocale] = useState(initialLocale);
  const resolvedMessagesByLocale = useMemo<TemplateLocaleResources>(
    () => messagesByLocale ?? { [activeLocale]: messages ?? {} },
    [activeLocale, messages, messagesByLocale],
  );
  const availableLocales = useMemo(
    () => Object.keys(resolvedMessagesByLocale).sort((left, right) => (left === "en" ? -1 : right === "en" ? 1 : left.localeCompare(right))),
    [resolvedMessagesByLocale],
  );

  useEffect(() => {
    if (locale) {
      setActiveLocale(locale);
    }
  }, [locale]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = activeLocale;
    }

    if (typeof window !== "undefined" && storageKey) {
      window.localStorage.setItem(storageKey, activeLocale);
    }
  }, [activeLocale, storageKey]);

  const instance = useMemo(
    () => createI18nInstance(activeLocale, resolvedMessagesByLocale),
    [activeLocale, resolvedMessagesByLocale],
  );
  const contextValue = useMemo<I18nContextValue>(
    () => ({
      locale: activeLocale,
      setLocale: setActiveLocale,
      availableLocales,
    }),
    [activeLocale, availableLocales],
  );

  return (
    <TemplateI18nContext.Provider value={contextValue}>
      <I18nextProvider i18n={instance}>{children}</I18nextProvider>
    </TemplateI18nContext.Provider>
  );
}

export function useI18n() {
  const { t: rawT, i18n } = useTranslation();
  const contextValue = useContext(TemplateI18nContext);

  const t = (key: TemplateI18nKey | string, fallback?: string, values?: TranslationValues) =>
    rawT(key, {
      ...values,
      defaultValue: ENGLISH_MESSAGES[key as TemplateI18nKey] ?? fallback ?? key,
    });

  return {
    locale: contextValue?.locale ?? i18n.language ?? "en",
    setLocale: contextValue?.setLocale ?? (() => undefined),
    availableLocales: contextValue?.availableLocales ?? [i18n.language ?? "en"],
    t,
  };
}
