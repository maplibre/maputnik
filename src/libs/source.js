export function deleteSource(mapStyle, sourceId) {
  const remainingSources = { ...mapStyle.sources}
  delete remainingSources[sourceId]
  return {
    ...mapStyle,
    sources: remainingSources
  }
}


export function addSource(mapStyle, sourceId, source) {
  return changeSource(mapStyle, sourceId, source)
}

export function changeSource(mapStyle, sourceId, source) {
  const changedSources = {
    ...mapStyle.sources,
    [sourceId]: source
  }
  return {
    ...mapStyle,
    sources: changedSources
  }
}

