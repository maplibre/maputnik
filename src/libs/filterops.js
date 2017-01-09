import GlSpec from 'mapbox-gl-style-spec/reference/latest.js'
export const combiningFilterOps = ['all', 'any', 'none']
export const setFilterOps = ['in', '!in']
export const otherFilterOps = Object
  .keys(GlSpec.filter_operator.values)
  .filter(op => combiningFilterOps.indexOf(op) < 0)
