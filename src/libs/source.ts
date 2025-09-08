import type {SourceSpecification} from "maplibre-gl";
import type {StyleSpecificationWithId} from "./definitions";

export function deleteSource(mapStyle: StyleSpecificationWithId, sourceId: string) {
  const remainingSources = { ...mapStyle.sources}
  delete remainingSources[sourceId]
  return {
    ...mapStyle,
    sources: remainingSources
  }
}


export function addSource(mapStyle: StyleSpecificationWithId, sourceId: string, source: SourceSpecification) {
  return changeSource(mapStyle, sourceId, source)
}

export function changeSource(mapStyle: StyleSpecificationWithId, sourceId: string, source: SourceSpecification) {
  const changedSources = {
    ...mapStyle.sources,
    [sourceId]: source
  }
  return {
    ...mapStyle,
    sources: changedSources
  }
}
