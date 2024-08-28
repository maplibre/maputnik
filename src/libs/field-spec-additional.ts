import { TFunction } from "i18next";

const spec = (t: TFunction) => ({
  maputnik: {
    maptiler_access_token: {
      label: t("MapTiler Access Token"),
      doc: t("Public access token for MapTiler Cloud.")
    },
    thunderforest_access_token: {
      label: t("Thunderforest Access Token"),
      doc: t("Public access token for Thunderforest services.")
    },
    stadia_access_token: {
      label: t("Stadia Maps API Key"),
      doc: t("API key for Stadia Maps.")
    },
    style_renderer: {
      label: t("Style Renderer"),
      doc: t("Choose the default Maputnik renderer for this style."),
    },
  }
})

export default spec;
