import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

export const supportedLanguages = {
  "de": "Deutsch",
  "en": "English",
  "fr": "Français",
  "he": "עברית",
  "it": "Italiano",
  "ja": "日本語",
  "zh": "简体中文"
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
    },
    saveMissing: true, // this needs to be set for missingKeyHandler to work
    fallbackLng: false, // we set the fallback to false so we can get the correct language in the missingKeyHandler
    missingKeyHandler: (lngs, _ns, key) => {
      if (lngs[0] === "en") { return; }
      console.warn(`Missing translation for "${key}" in "${lngs.join(", ")}"`);
    }
  });

export default i18n;
