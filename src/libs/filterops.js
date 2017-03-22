import GlSpec from 'mapbox-gl/src/style-spec/reference/latest'
export const combiningFilterOps = ['all', 'any', 'none']
export const setFilterOps = ['in', '!in']
export const otherFilterOps = Object
  .keys(GlSpec.filter_operator.values)
  .filter(op => combiningFilterOps.indexOf(op) < 0)
