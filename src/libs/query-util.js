function asBool(queryObj, key) {
  if(queryObj.hasOwnProperty(key)) {
    return !queryObj[key].match(/^false|0$/);
  }
  else {
    return false;
  }
}

module.exports = {
  asBool
}
