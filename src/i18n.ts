import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// TODO: move this to a JSON file
const resources = {
  ja: {
    translation: {
      "Open": "開く",
      "Export": "エクスポート",
      "Data Sources": "データソース",
      "Style Settings": "スタイル設定",
      "View": "表示",
      "Map": "地図",
      "Inspect": "検証",
      "Color accessibility": "色のアクセシビリティ",
      "Deuteranopia filter": "緑色弱者フィルタ",
      "Protanopia filter": "赤色弱者フィルタ",
      "Tritanopia filter": "青色弱者フィルタ",
      "Achromatopsia filter": "色盲フィルタ",
      "Help": "ヘルプ",
    }
  }
};

i18n
  .use(detector) // detect user language from browser settings
  .use(initReactI18next) // required to initialize react-i18next
  .init({
    resources,

    interpolation: {
      escapeValue: false // React already escapes for us
    }
  });

export default i18n;
