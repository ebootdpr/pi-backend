function num(value) {
  if (value > 47 && value < 58) return true;
  return false
}
function ucase(value) {
  if (value > 64 && value < 91) return true;
  return false
}
function lcase(value) {
  if (value > 96 && value < 123) return true;
  return false
}
function isAlphaNumeric(inputStr) {
  if (inputStr.length < 3) return [false, 'Debe ser mayor a 3 caracteres']
  let code = inputStr.charCodeAt(0);
  if (!ucase(code)) return [false, 'Debe comenzar con mayusculas'];
  const arrayDeStrings = inputStr.split(' ')
  for (const str of arrayDeStrings) {
    if(!str) return [false, 'No debe contener multiples espacios o terminar en espacio']
    for (let i = 1; i < str.length; i++) {
      code = str.charCodeAt(i);
      if (!num(code) && // numeric (0-9)
        !ucase(code) && // upper alpha (A-Z)
        !lcase(code)) { // lower alpha (a-z)
        return [false, 'Debe ser alfanumérico'];
      }
    }
  }
  return [true, 'Validado'];
};
