export default class ZoomControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group maplibregl-ctrl-zoom';
    this._container.setAttribute("data-wd-key", "maplibre:ctrl-zoom");
    this._container.innerHTML = `
      Zoom: <span></span>
    `;
    this._textEl = this._container.querySelector("span");
    
    this.addEventListeners();
    
    return this._container;
  }
  
  updateZoomLevel() {
    this._textEl.innerHTML = this._map.getZoom().toFixed(2);
  }
  
  addEventListeners (){
    this._map.on('render', this.updateZoomLevel.bind(this) );
    this._map.on('zoomIn', this.updateZoomLevel.bind(this) );
    this._map.on('zoomOut', this.updateZoomLevel.bind(this) );
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
