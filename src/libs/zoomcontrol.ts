import type { Map } from "maplibre-gl";

export default class ZoomControl {
  _map: Map | undefined = undefined;
  _container: HTMLDivElement | undefined = undefined;
  _textEl: HTMLSpanElement | null = null;

  constructor() {}

  onAdd(map: Map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className =
      "maplibregl-ctrl maplibregl-ctrl-group maplibregl-ctrl-zoom";
    this._container.setAttribute("data-wd-key", "maplibre:ctrl-zoom");
    this.setLabel("Zoom:");
    this.addEventListeners();

    return this._container;
  }

  updateZoomLevel() {
    this._textEl!.innerHTML = this._map!.getZoom().toFixed(2);
  }

  setLabel(label: string) {
    this._container!.innerHTML = `
      ${label} <span></span>
    `;
    this._textEl = this._container!.querySelector("span");
    this.updateZoomLevel();
  }

  addEventListeners() {
    this._map!.on("render", () => this.updateZoomLevel());
    this._map!.on("zoomIn", () => this.updateZoomLevel());
    this._map!.on("zoomOut", () => this.updateZoomLevel());
  }

  onRemove() {
    this._container!.parentNode!.removeChild(this._container!);
    this._map = undefined;
  }
}
