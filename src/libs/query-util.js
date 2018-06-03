function asBool(queryObj, key) {
  if(queryObj.hasOwnProperty(key)) {
    if(queryObj[key].match(/^false|0$/)) {
      return false;
    }
    else {
      return true;
    }
  }
  else {
    return false;
  }
}

module.exports = {
  asBool
}
