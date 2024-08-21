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
    style_renderer: {
      label: t("Style Renderer"),
      doc: t("Choose the default Maputnik renderer for this style."),
    },
  }
})

export default spec;
