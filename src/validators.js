const { validCountryAtts, validActivitiesAtts, validSeasons, validContinents, validActivitiesAttsAct_ } = require('./constantes');
function strIsNumeric(str) {
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (!isNum(code)) {
      return false;
    }
  }
  return true
}
function isNum(value, skip = false) {
  if (skip) return false;
  if (value > 47 && value < 58) return true;
  return false
}
function ucase(value) {
  if (value > 64 && value < 91) return true;
  return false
}
function tildes(value) {
  if (value > 159 && value < 166) return true;
  if (value === 144 || value === 130 || value === 241) return true;
}
function lcase(value) {
  if (value > 96 && value < 123) return true;

  return false
}
function isAlphaNumeric(inputStr, ignoreUnits = false, isCCA3 = false) {
  let code = inputStr.charCodeAt(0);
  if (isCCA3 && inputStr.length !== 3)
    return [false, 'CCA3 Debe ser igual de longitud de 3 caracteres'];
  if (!ignoreUnits) {
    if (inputStr.length < 3) return [false, 'Debe ser mayor a 3 caracteres']
    if (!ucase(code)) return [false, 'Debe comenzar con mayusculas'];
  }
  const arrayDeStrings = inputStr.split(' ')
  for (const str of arrayDeStrings) {
    if (!ignoreUnits || isCCA3) if (!str)
      return [false, 'No debe contener multiples espacios o terminar en espacio']
    for (let i = 0; i < str.length; i++) {
      code = str.charCodeAt(i);
      if (
        !isNum(code, isCCA3) && // numeric (0-9)
        !ucase(code) && // upper alpha (A-Z)
        !lcase(code) &&
        !tildes(code)) { // lower alpha (a-z)
        if (isCCA3)
          return [false, 'Debe ser alfabético, sin números. Caracter inválido:' + String.fromCharCode(code)];
        return [false, 'Debe ser alfanumérico, caracter inválido:' + String.fromCharCode(code)];
      }
    }
  }
  return [true, 'Validado'];
};
const validateBodyActivities = (body) => {
  if (!Array.isArray(body)) throw new Error('Se debe de enviar un array de actividades por body=[act1,act2...]');
  for (const ele of body) {
    const bodyKeys = Object.keys(ele)
    if (bodyKeys.length === 0) throw new Error('No se envió nada por body');
    bodyKeys.forEach(key => {
      if (!validActivitiesAtts.includes(key)) {
        throw new Error(`No se paso un body valido, debería recibir:
   ${validActivitiesAtts}
   se recibió:
   ${ele.season} `);
      }
    })
    if (!isAlphaNumeric(ele.name)[0]) throw new Error('name ' + isAlphaNumeric(ele.name)[1]);
    if (!isAlphaNumeric(ele.season)[0]) throw new Error('season ' + isAlphaNumeric(ele.season)[1]);
    if (!validSeasons.includes(ele.season)) throw new Error('Season incorrecta, valid seasons: ' + validSeasons);
    if (!strIsNumeric(ele.difficulty)) throw new Error('difficulty is NaN');
    if (!strIsNumeric(ele.duration)) throw new Error('duration is NaN');
    if (!parseInt(ele.difficulty) > 0 && !parseInt(ele.difficulty) < 6) throw new Error('Difficulty no está entre 1 y 5');
    if (!parseInt(ele.duration) > 0) throw new Error('Duration debe ser mayor a 0');
  }
}
const validateBodyForBulk = (input) => {
  if (!Array.isArray(input)) throw new Error('Body debe ser un array de paises a crear');
  if (input.length === 0) throw new Error('Debe contener al menos un pais');
  if (Object.keys(input[0]).length === 0) throw new Error('Debe contener un pais no vacío')
}
const validateString = (input) => {
  const queryKeys = Object.keys(input)
  for (const key of queryKeys) {
    if (typeof input[key] !== 'string')
      throw new Error('Uno de los valore recibidos no es tipo string: ' + key);
  }

}
const validateCCA3 = (str) => {
  const status = isAlphaNumeric(str, true, true)
  if (!status[0])
    throw new Error(status[1]);

}
const validateQuery = (input) => {
  const queryKeys = Object.keys(input)
  for (const key of queryKeys) {
    if (!validCountryAtts.includes(key))
      throw new Error('Uno de los query es inválido, recibido: ' + queryKeys + ' validos:' + validCountryAtts);
    if (input[key] && !isAlphaNumeric(input[key], true)[0])
      throw new Error(isAlphaNumeric(input[key])[1]);
  }

  if (input.continents && !validContinents.includes(input.continents))
    throw new Error('Debe escribir el nombre completo del continente y debe ser uno de estos: ' + validContinents);
  if (input.area && !strIsNumeric(input.area))
    throw new Error('area debe ser un número');
  if (input.population && !strIsNumeric(input.population))
    throw new Error('population debe ser un número');
  return true;
};
const validateCountry = (input) => {
  const queryKeys = Object.keys(input)
  for (const key of queryKeys) {
    if (!validCountryAtts.includes(key))
      throw new Error('Clave inválida:' + key);
  }
  if (!input.cca3 || !input.name || !input.flags || !input.capital || !input.continents)
    throw new Error('cca3, name, flags, continents, y capital no deben ser nulos!');
  if (!isAlphaNumeric(input.cca3, true)[0])
    throw new Error('cca3 ' + isAlphaNumeric(input.name, true)[1]);
  if (input.cca3.length !== 3 || input.cca3 !== input.cca3.toUpperCase())
    throw new Error('cca3 must be uppercase and length 3');
  if (!isAlphaNumeric(input.name)[0]) throw new Error('name: ' + isAlphaNumeric(input.name)[1]);
  if (!isAlphaNumeric(input.capital)[0]) throw new Error('capital: ' + isAlphaNumeric(input.capital)[1]);
  if (input.subregion && !isAlphaNumeric(input.subregion)[0]) throw new Error('subregion: ' + isAlphaNumeric(input.subregion)[1]);
  if (input.continents && !validContinents.includes(input.continents))
    throw new Error('Debe escribir el nombre completo del continente y debe ser uno de estos: ' + validContinents);
  if (input.area && !strIsNumeric(input.area))
    throw new Error('area debe ser un número');
  if (input.population && !strIsNumeric(input.population))
    throw new Error('population debe ser un número');
  return true;
};
const validateAssignBody = (reqbody) => {
  if (!Array.isArray(reqbody) || !Array.isArray(reqbody[0]) || !Array.isArray(reqbody[1]) || reqbody.length !== 2)
    throw new Error('Debe enviar un array de longitud 2 que contengan 0: cca3 array de paises y 1: array de ID de actividades');
  for (const cca3 of reqbody[0]) {
    validateCCA3(cca3)
  }
  for (const id of reqbody[1]) {
    if (!strIsNumeric('' + id + '')) throw new Error('la id debe ser numerica, se recibió ' + id);
  }
}

const validatePageRoute = (params, querys, body) => {

  let page = params.pgnumber, whereObj = null, whereObjIncludes = null, orden = [['cca3', 'ASC']]
  if (body.hasOwnProperty('0')) {
    if (!Array.isArray(body) && !(body.length === 1) && typeof body[0][1] !== 'string' && typeof body[0][0] !== 'string')
      throw new Error('Body inválido, debe ser un array con 2 strings como elementos')
    if (!validCountryAtts.includes(body[0][0]))
      throw new Error('El primer elemento debe ser uno de estos ' + validCountryAtts)
    if (!['ASC', 'DESC'].includes(body[0][1]))
      throw new Error('body debe ser ASC o DESC')
    orden = body
  }
  if (isNaN(page)) throw new Error('Debe ingresar un valor numérico');

  //? Checkea y filtra querys para generar los where
  const keyQuerys = Object.keys(querys)
  const whereKeys = keyQuerys.filter(key => validCountryAtts.includes(key))
  const whereIncludeKeys = keyQuerys.filter(key => validActivitiesAttsAct_.includes(key))
  if (whereKeys.length > 0) {
    whereObj = {}
    whereKeys.forEach(key => {
      whereObj[key] = querys[key]
    })
  }
  if (whereIncludeKeys.length > 0) {
    whereObjIncludes = {}
    whereIncludeKeys.map(key => {
      return key.slice(4)
    }).forEach(key => {
      whereObjIncludes[key] = querys['act_' + key]
    })
  }
  return { page, whereObj, whereObjIncludes, orden }
}


const countriesQuery = (querys) => {
  //los query deben contener los filtros de country
  let whereObj = null
  let whereObjIncludes = null
  //? Checkea y filtra querys para generar los where
  // * Aprovechand que los querys siempre son strings, filtramos los querys correctos
  // ? DISEÑO
  /**
   * * el whereKeys se usara dentro del where: del findAll de sequelize
   * * i.e.:  findAll({ where: whereKeys})
   * * el whereIncludeKeys el el where que esté dentro del include
   * * i.e.:  findAll({ includes: {where: whereKeys}})
   * * Ambos seran filtrados solo con los valores validos, asi si se ingresa un query invalido, simplemente
   * * se lo ignora
   * ! para hacer query de activity se debe usar prefijo act_ para cada atributo
   */
  const keyQuerys = Object.keys(querys)
  const whereKeys = keyQuerys.filter(key => validCountryAtts.includes(key))
  const whereIncludeKeys = keyQuerys.filter(key => validActivitiesAttsAct_.includes(key))
  if (whereKeys.length > 0) {
    whereObj = {}
    whereKeys.forEach(key => {
      whereObj[key] = querys[key]
    })
  }
  if (whereIncludeKeys.length > 0) {
    whereObjIncludes = {}
    whereIncludeKeys.map(key => {
      return key.slice(4)
    }).forEach(key => {
      whereObjIncludes[key] = querys['act_' + key]
    })
  }

  //estos objetos deben ser procesados por un controller
  return { whereObj, whereObjIncludes }
}

const countriesBody = (body) => {

  /** 
   * ? DISEÑO
   * * body = {
   * * orden: [['cca3', 'ASC']]
   * * page: 
   * * }
   * * Revisar si es objeto y si esta vacio igno
   * * 
   */
  if (typeof body !== 'object') throw new Error(`No se recibio un object por body Debe enviar un body tipo JSON Objeto con orden: [['atributo, ejemplo cca3 o name', 'ASC o DESC']]  y page: #`);


  //body.page
  if (body.page === undefined) body.page = null; //evita la paginación
  else {    
    if (isNaN(parseInt(body.page))) throw new Error('Debe ingresar un valor numérico en el body.page');
    body.page = parseInt(body.page);
  }
  if (body.orden === undefined) body.orden = null
  else {
    if (body.orden.hasOwnProperty('0')) {
      if (!Array.isArray(body.orden) && !(body.orden.length === 1) && typeof body.orden[0][1] !== 'string' && typeof body.orden[0][0] !== 'string')
        throw new Error('body.orden inválido, debe ser un array con 2 strings como elementos')
      if (!validCountryAtts.includes(body.orden[0][0]))
        throw new Error('El primer elemento debe ser uno de estos ' + validCountryAtts)
      if (!['ASC', 'DESC'].includes(body.orden[0][1]))
        throw new Error('body.orden debe ser ASC o DESC')
    }
  }
  return body
}


module.exports = {
  isAlphaNumeric,
  isNum,
  validateBodyActivities,
  validateQuery,
  validateBodyForBulk,
  validateCountry,
  validateString,
  validateCCA3,
  validateAssignBody,
  validatePageRoute,
  countriesBody,
  countriesQuery,
}
