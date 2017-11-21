module.exports = {
  "$": function(key, selector) {
    selector = selector || "";
    return "*[data-wd-key='"+key+"'] "+selector;
  }
}
