export default function(a, b) {
  a = parseFloat(a);
  b = parseFloat(b);

  if(a < b) {
    return -1
  }
  else if(a > b) {
    return 1
  }
  else {
    return 0;
  }
}
