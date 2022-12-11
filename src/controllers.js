const { API_URL, validCountryAtts } = require('./constantes')
const axios = require('axios')
const { Country, Op, conn, Activities } = require("./db");

/**
 * Checkea si es objeto
 * * true: toma el primero, 
 * * false: lo retorna.
 * */
function CheckeoRecursivo(input) {
  if (typeof input !== 'object') {
    return input
  }
  return CheckeoRecursivo(input[Object.keys(input)[0]])
};
/**
 * Filtra usando MODELKEYS
 * @param {Array} DB Objetos a checkear
 * @param {Array} MODELKEYS Strings de attributos a checkear
 * @returns Array de objetos filtrados
 */
function filtrarArray(DB) {
  return DB.map(ele => {
    const obj = {}
    validCountryAtts.forEach(str => {
      if (ele[str]) {
        obj[str] = CheckeoRecursivo(ele[str])
      }
    })
    return obj
  })
};

/**
 * 
 * @param {Array} input Array de paises
 * @param {Model} Country Sequelize model
 */
async function fillCountries(input) {
  const promesas = input.map(async ele => {
    if (ele.cca3) {
      const found = await Country.findOne({ where: { cca3: ele.cca3 } });
      if (found) throw new Error('id existente');
      return Country.create({
        name: 'Sin nombre',
        flags: 'https://pixy.org/src/46/467785.png',
        continents: 'Other',
        capital: 'Sin capital',
        subregion: 'Sin subregion',
        ...ele
      })
    }
  })
  await Promise.all(promesas)
};

module.exports = {
  //fetchea TODA la API y retorna el resultado
  fetchApi: async function () {
    console.log('recopilando datos de ' + API_URL + ' por unica vez...')
    const response = await axios.get(API_URL)
    console.log('test1');
    const DB = response.data
    const dbFiltrada = filtrarArray(DB)
    await fillCountries(dbFiltrada)
  },
  getWhereConditions: (query) => {
    const queryKeys = Object.keys(query)
    let conditions = {}
    console.log('d1');
    queryKeys.forEach(key => {
      if (validCountryAtts.includes(key) && query[key]) {
        if (key === 'population' || key === 'area') {
          conditions[key] = { [Op.gte]: query[key] }
        } else {
          conditions[key] = { [Op.iLike]: `%${query[key]}%` }
        }
      };
    });
    console.log('d2');
    if (Object.keys(conditions).length === 0) return validCountryAtts;
    console.log(conditions);
    return conditions;
  },

  findDB: async function (cond = null) {
    const arr = await Country.findAll({ where: cond })
    if (arr.length === 0) throw new Error('No se encontró ninguna coincidencia');
    return arr
  },
  /**
   * 
   * @param {Object} query Objeto que contiene todas las query.
   * @returns Un objeto listo para introducir dentro del where: 
   */

  pushActivitiesToDb: async (body) => {

  }



}