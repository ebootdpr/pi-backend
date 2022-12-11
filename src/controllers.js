const { API_URL } = require('./constantes')
const axios = require('axios')
const { Country, Op, CountryKeys, conn } = require("./db");

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
function filtrarArray(DB, MODELKEYS) {
  return DB.map(ele => {
    const obj = {}
    MODELKEYS.forEach(str => {
      if (ele[str]) {
        obj[str] = CheckeoRecursivo(ele[str])
      }
    })
    return obj
  })
};

/**
 * 
 * @param {Array} apiFiltrada Array de paises
 * @param {Model} model Sequelize model
 */
async function fillCountries(apiFiltrada, model) {
  const promesas = apiFiltrada.map(async ele => {
    if (ele.cca3) {
      const found = await model.findOne({ where: { cca3: ele.cca3 } });
      if (found) throw new Error('id existente');
      return model.create({
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
    const DB = response.data
    const dbFiltrada = filtrarArray(DB, CountryKeys)
    await fillCountries(dbFiltrada, Country)
    return await Country.findAll()
  },

  findDB: async function (string, constraints = null) {
    switch (string) {
      case 'Countries':
        return await Country.findAll({ where: constraints })
      case 'Activities':
        return await Activities.findAll({ where: constraints })
        break;
      default:
        throw new Error('error en ,debe especificar modelo en findDB')
        break;
    }
  }


}