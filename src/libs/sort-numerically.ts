export default function(num1: string | number, num2: string| number) {
  const a = +num1;
  const b = +num2;

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
