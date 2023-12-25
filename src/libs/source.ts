import type {StyleSpecification, SourceSpecification} from "maplibre-gl";

export function deleteSource(mapStyle: StyleSpecification, sourceId: string) {
  const remainingSources = { ...mapStyle.sources}
  delete remainingSources[sourceId]
  return {
    ...mapStyle,
    sources: remainingSources
  }
}


export function addSource(mapStyle: StyleSpecification, sourceId: string, source: SourceSpecification) {
  return changeSource(mapStyle, sourceId, source)
}

export function changeSource(mapStyle: StyleSpecification, sourceId: string, source: SourceSpecification) {
  const changedSources = {
    ...mapStyle.sources,
    [sourceId]: source
  }
  return {
    ...mapStyle,
    sources: changedSources
  }
}

