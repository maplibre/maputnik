import {StyleSpecification, diff} from '@maplibre/maplibre-gl-style-spec'

function diffMessages(beforeStyle: StyleSpecification, afterStyle: StyleSpecification) {
  const changes = diff(beforeStyle, afterStyle)
  return changes.map(cmd => cmd.command + ' ' + cmd.args.join(' '))
}

export function undoMessages(beforeStyle: StyleSpecification, afterStyle: StyleSpecification) {
  return diffMessages(beforeStyle, afterStyle).map(m => 'Undo ' + m)
}
export function redoMessages(beforeStyle: StyleSpecification, afterStyle: StyleSpecification) {
  return diffMessages(beforeStyle, afterStyle).map(m => 'Redo ' + m)
}