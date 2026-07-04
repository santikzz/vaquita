import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as z from 'zod';
import { setDefaultOptions } from 'date-fns';
import { es as esLocale } from 'date-fns/locale/es';
import { enUS as enLocale } from 'date-fns/locale/en-US';
import en from './locales/en.json';
import es from './locales/es.json';

i18n.use(initReactI18next).init({
    lng: localStorage.getItem('lang') || 'es',
    fallbackLng: 'es',
    resources: {
        en: en,
        es: es,
    },
    interpolation: {
        escapeValue: false,
    },
});

export const updateZodLocale = (lang: string) => {
    switch (lang) {
        case 'es':
            z.config(z.locales.es());
            break;
        case 'en':
            z.config(z.locales.en());
            break;
        default:
            z.config(z.locales.es());
    }
};

export const updateDateFnsLocale = (lang: string) => {
    switch (lang) {
        case 'es':
            setDefaultOptions({ locale: esLocale });
            break;
        case 'en':
            setDefaultOptions({ locale: enLocale });
            break;
        default:
            setDefaultOptions({ locale: esLocale });
    }
};

export function changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    updateZodLocale(lang);
    updateDateFnsLocale(lang);
}

updateZodLocale(i18n.language);
updateDateFnsLocale(i18n.language);
globalThis.t = (key: string, options?: any) => i18n.t(key, options) as string;

export default i18n;