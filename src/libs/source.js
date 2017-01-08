export function deleteSource(mapStyle, sourceId) {
  const remainingSources = { ...mapStyle.sources}
  delete remainingSources[sourceId]
  const changedStyle = {
    ...mapStyle,
    sources: remainingSources
  }
  return changedStyle
}


export function addSource(mapStyle, sourceId, source) {
  return changeSource(mapStyle, sourceId, source)
}

export function changeSource(mapStyle, sourceId, source) {
  const changedSources = {
    ...mapStyle.sources,
    [sourceId]: source
  }
  const changedStyle = {
    ...mapStyle,
    sources: changedSources
  }
  return changedStyle
}

