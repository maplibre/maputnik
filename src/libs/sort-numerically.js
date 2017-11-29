export default function(a, b) {
  a = parseFloat(a, 10);
  b = parseFloat(b, 10);

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
