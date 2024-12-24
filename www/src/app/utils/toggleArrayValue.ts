export function toggleArrayValue(array: any[], value: any) {
  var index = array.indexOf(value);

  if (index === -1) {
    array.push(value);
  } else {
    array.splice(index, 1);
  }
}
