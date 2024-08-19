import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

export const supportedLanguages = {
  "en": "English",
  "ja": "日本語",
  "he": "עברית",
} as const;

i18n
  .use(detector) // detect user language from browser settings
  .use(
    resourcesToBackend((lang: string, ns: string) => {
      if (lang === "en") {
        // English is the default language, so we don't need to load any resources for it.
        return {};
      }
      return import(`./locales/${lang}/${ns}.json`);
    })
  )
  .use(initReactI18next) // required to initialize react-i18next
  .init({
    supportedLngs: Object.keys(supportedLanguages),
    keySeparator: false, // we do not use keys in form messages.welcome
    nsSeparator: false,
    interpolation: {
      escapeValue: false // React already escapes for us
    }
  });

export default i18n;
