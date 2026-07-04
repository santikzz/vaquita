import { enUS } from 'date-fns/locale/en-US';
import { es } from 'date-fns/locale/es';
import type { Locale } from 'date-fns';

const localeMap: Record<string, Locale> = {
    en: enUS,
    es,
};

/** Returns the date-fns Locale for a given i18n language code. Defaults to enUS. */
export function getDateFnsLocale(lang: string): Locale {
    return localeMap[lang] ?? enUS;
}
