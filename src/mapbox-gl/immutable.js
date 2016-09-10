import Immutable from 'immutable'
import spec from 'mapbox-gl-style-spec/reference/latest.min.js'

function memberDefaults(type) {
	const fields = {}
	for(let fieldName in type) {
		fields[fieldName] = immutableDefault(type[fieldName])
	}
	return fields
}

function immutableDefault(obj) {
	if(obj.default) return obj.default

	// Known spec defaults
	if(obj.type === "filter") return new Immutable.List()
	if(obj.type === "sources") return new Immutable.List()
	if(obj.type === "array" && obj.value === "layer") return new Immutable.OrderedMap()

	// Deal with primitives
	if(obj.type === "boolean") return false
	if(obj.type === "string") return ""
	if(obj.type === "number") return 0
	if(obj.type === "enum") return obj.values[0]
	if(obj.type === "*") return new Immutable.Map()
	if(obj.type === "array") return new Immutable.List()

	return new Immutable.Map()
}

function TypeRecord(type) {
	return Immutable.Record(memberDefaults(spec[type]))
}

export const SourceTile = TypeRecord("source_tile")
export const SourceGeojson = TypeRecord("source_geojson")

export const LayoutBackground = TypeRecord("layout_background")
export const LayoutFill = TypeRecord("layout_fill")
export const LayoutCircle = TypeRecord("layout_circle")
export const LayoutLine = TypeRecord("layout_line")
export const LayoutSymbol = TypeRecord("layout_symbol")
export const LayoutRaster = TypeRecord("layout_raster")

export const PaintBackground = TypeRecord("paint_background")
export const PaintFill = TypeRecord("paint_fill")
export const PaintCircle = TypeRecord("paint_circle")
export const PaintLine = TypeRecord("paint_line")
export const PaintSymbol = TypeRecord("paint_symbol")
export const PaintRaster = TypeRecord("paint_raster")

export const MapboxGlStyle = Immutable.Record({
	...memberDefaults(spec['$root']),
	id: Math.random().toString(36).substr(2, 9),
	created: new Date().toJSON()
})

//TODO: Ugly?
function LayerRecord(layerType) {
	const defaults = memberDefaults(spec["layer"])
	defaults["type"] = layerType

	if(layerType === "fill") {
		defaults["layout"] = new LayoutFill
		defaults["paint"] = new PaintFill()
	} if(layerType === "line") {
		defaults["layout"] = new LayoutLine()
		defaults["paint"] = new PaintLine()
	} if(layerType === "symbol") {
		defaults["layout"] = new LayoutSymbol()
		defaults["paint"] = new PaintSymbol()
	} if(layerType === "circle") {
		defaults["layout"] = new LayoutCircle()
		defaults["paint"] = new PaintCircle()
	} if(layerType === "raster") {
		defaults["layout"] = new LayoutRaster()
		defaults["paint"] = new PaintRaster()
	} else if(layerType === "background") {
		defaults["layout"] = new LayoutBackground()
		defaults["paint"] = new PaintBackground()
	}

	return Immutable.Record(defaults)
}

// Each layer type has default layout and paint
export const FillLayer = LayerRecord("fill")
export const LineLayer = LayerRecord("line")
export const SymbolLayer = LayerRecord("symbol")
export const CircleLayer = LayerRecord("circle")
export const RasterLayer = LayerRecord("raster")
export const BackgroundLayer = LayerRecord("background")

function createLayer(type) {
	switch(type) {
			case "fill":
					return new FillLayer()
			case "line":
					return new LineLayer()
			case "symbol":
					return new SymbolLayer()
			case "circle":
					return new CircleLayer()
			case "raster":
					return new RasterLayer()
			case "background":
					return new BackgroundLayer()
			default:
					throw "No Layer with type " + type + " exists"
	}
}

// Turn a Mapbox GL style JSON into an immutable MapboxGlStyle
export function fromJSON(jsonStyle) {
	let record = new MapboxGlStyle()

	for (let key in jsonStyle) {
		if(key === "layers") {
			record = record.set(key, Immutable.OrderedMap(jsonStyle[key].map(layer => {
				let layerRecord = createLayer(layer.type)

				for (let key in layer) {
					layerRecord = layerRecord.set(key, layer[key])
				}

				return [layer.id, layerRecord]
			})))
		} else {
			record = record.set(key, jsonStyle[key])
		}
	}

	return record
}

// Turn the immutable MapboxGlStyle into a Mapbox GL style JSON
export function toJSON() {

}
