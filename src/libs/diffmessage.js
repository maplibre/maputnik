import diffStyles from 'mapbox-gl-style-spec/lib/diff'

export function diffMessages(beforeStyle, afterStyle) {
  const changes = diffStyles(beforeStyle, afterStyle)
  return changes.map(cmd => cmd.command + ' ' + cmd.args.join(' '))
}

export function undoMessages(beforeStyle, afterStyle) {
  return diffMessages(beforeStyle, afterStyle).map(m => 'Undo ' + m)
}
export function redoMessages(beforeStyle, afterStyle) {
  return diffMessages(beforeStyle, afterStyle).map(m => 'Redo ' + m)
}
