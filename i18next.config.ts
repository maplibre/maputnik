import { defineConfig } from "i18next-cli";

export default defineConfig({
  locales: ["de", "fr", "he", "it", "ja", "ko", "zh"],
  extract: {
    input: ["src/**/*.{js,jsx,ts,tsx}"],
    output: "src/locales/{{language}}/{{namespace}}.json",
    defaultValue: "__STRING_NOT_TRANSLATED__"
  }
});
