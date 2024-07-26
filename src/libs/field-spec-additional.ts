const spec = {
  maputnik: {
    maptiler_access_token: {
      label: "MapTiler Access Token",
      doc: "Public access token for MapTiler Cloud."
    },
    thunderforest_access_token: {
      label: "Thunderforest Access Token",
      doc: "Public access token for Thunderforest services."
    },
    syte_access_token: {
      label: "syte Access Token",
      doc: "Public access token for Syte services. 1h time to live."
    },
    style_renderer: {
      label: "Style Renderer",
      doc: "Choose the default Maputnik renderer for this style.",
    },
  }
}

export default spec;
