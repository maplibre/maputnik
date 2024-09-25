import { TFunction } from "i18next";

const spec = (t: TFunction) => ({
  maputnik: {
    maptiler_access_token: {
      label: t("MapTiler Access Token"),
      doc: t("Public access token for MapTiler Cloud."),
      docUrl: "https://docs.maptiler.com/cloud/api/authentication-key/",
      docUrlLinkText: t("Learn More")
    },
    thunderforest_access_token: {
      label: t("Thunderforest Access Token"),
      doc: t("Public access token for Thunderforest services."),
      docUrl: "https://www.thunderforest.com/docs/apikeys/",
      docUrlLinkText: t("Learn More")
    },
    stadia_access_token: {
      label: t("Stadia Maps API Key"),
      doc: t("API key for Stadia Maps."),
      docUrl: "https://docs.stadiamaps.com/authentication/",
      docUrlLinkText: t("Learn More")
    },
    style_renderer: {
      label: t("Style Renderer"),
      doc: t("Choose the default Maputnik renderer for this style.")
    },
  }
})

export default spec;
