import * as styleSpec from '@mapbox/mapbox-gl-style-spec/style-spec'
export const combiningFilterOps = ['all', 'any', 'none']
export const setFilterOps = ['in', '!in']
export const otherFilterOps = Object
  .keys(styleSpec.latest.filter_operator.values)
  .filter(op => combiningFilterOps.indexOf(op) < 0)
