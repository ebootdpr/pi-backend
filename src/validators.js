const { validCountryAtts, validActivitiesAtts, validSeasons, validContinents } = require('./constantes');
function strIsNumeric(str) {
 for (let i = 1; i < str.length; i++) {
  const code = str.charCodeAt(i);
  if (!isNum(code)) { // lower alpha (a-z)
   return false;
  }
 }
 return true
}
function isNum(value) {
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
function isAlphaNumeric(inputStr, ignoreUnits = false) {
 let code = inputStr.charCodeAt(0);
 if (!ignoreUnits) {
  if (inputStr.length < 3) return [false, 'Debe ser mayor a 3 caracteres']
  if (!ucase(code)) return [false, 'Debe comenzar con mayusculas'];
 }
 const arrayDeStrings = inputStr.split(' ')
 for (const str of arrayDeStrings) {
  if (!ignoreUnits) if (!str) return [false, 'No debe contener multiples espacios o terminar en espacio']
  for (let i = 1; i < str.length; i++) {
   code = str.charCodeAt(i);
   if (!isNum(code) && // numeric (0-9)
    !ucase(code) && // upper alpha (A-Z)
    !lcase(code)) { // lower alpha (a-z)
    return [false, 'Debe ser alfanumérico'];
   }
  }
 }
 return [true, 'Validado'];
};
const validateBodyActivities = (body) => {
 const bodyKeys = Object.keys(body)
 bodyKeys.forEach(key => {
  if (!validActivitiesAtts.includes(key)) {
   throw new Error(`No se paso un body valido, debería recibir:
   ${validActivitiesAtts}
   se recibió:
   ${bodyKeys} `);
  }
 })

 if (isAlphaNumeric(body.name)[0] &&
  isAlphaNumeric(body.season)[0] &&
  validSeasons.includes(body.season) &&
  isNum(body.difficulty) &&
  isNum(body.duration) &&
  body.difficulty > 1 &&
  body.difficulty > 6 &&
  body.duration > 0) {
 } else {
  throw new Error('Algún valor que se envió por body es incorrecto')
 }
 return true
 return { ...body, difficulty: parseInt(body.difficulty), duration: parseInt(body.duration) }

}

const validateQuery = (query) => {
 const queryKeys = Object.keys(query)
 queryKeys.forEach(key => {
  if (!validCountryAtts.includes(key)) {
   throw new Error('Uno de los query es inválido, recibido:\n' + queryKeys + '\n validos:\n' + validCountryAtts);
  }
  if (query[key] && !isAlphaNumeric(query[key], true)[0]) {
   throw new Error(isAlphaNumeric(query[key])[1]);
  }
 });
 if (query.continents && !validContinents.includes(query.continents)) {
  throw new Error('Debe escribir el nombre completo del continente y debe ser uno de estos: ' + validContinents);
 }
 if (query.area && !strIsNumeric(query.area)) {
  throw new Error('area debe ser un número');
 }
 if (query.population && !strIsNumeric(query.population)) {
  console.log('Error 83')
  throw new Error('population debe ser un número');
 }
 console.log('validacion OK');
 return true;
};

module.exports = {
 isAlphaNumeric,
 isNum,
 validateBodyActivities,
 validateQuery
}