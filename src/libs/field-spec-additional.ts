const spec = {
  maputnik: {
    auth_access_token: {
      label: "Auth Access Token",
      doc: "User specific access token for custom vector tiles sources, added as access_token param."
    },
    maptiler_access_token: {
      label: "MapTiler Access Token",
      doc: "Public access token for MapTiler Cloud."
    },
    thunderforest_access_token: {
      label: "Thunderforest Access Token",
      doc: "Public access token for Thunderforest services."
    },
    style_renderer: {
      label: "Style Renderer",
      doc: "Choose the default Maputnik renderer for this style.",
    },
  }
}

export default spec;
