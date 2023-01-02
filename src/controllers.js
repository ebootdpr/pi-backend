const { API_URL, validCountryAtts, validActivitiesAtts } = require('./constantes')
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
  fetchApi: async function() {
    console.log('recopilando datos de ' + API_URL + ' por unica vez...')
    const response = await axios.get(API_URL)
    const DB = response.data
    const dbFiltrada = filtrarArray(DB)
    await fillCountries(dbFiltrada)
  },
  getWhereConditions: (whereObj) => {
    const queryKeys = Object.keys(whereObj)
    let conditions = {}
    queryKeys.forEach(key => {
      if (validCountryAtts.includes(key) && whereObj[key]) {
        if (key === 'population' || key === 'area') {
          conditions[key] = { [Op.gte]: whereObj[key] }
        } else {
          conditions[key] = { [Op.iLike]: `%${whereObj[key]}%` }
        }
      };
    });
    if (Object.keys(conditions).length === 0) return validCountryAtts;
    return conditions;
  },
  getWhereConditionsActivities: (whereObjIncludes) => {
    const objKeys = Object.keys(whereObjIncludes)
    let conditions = {}
    objKeys.forEach(key => {
      if (validActivitiesAtts.includes(key) && whereObjIncludes[key]) {
        if (key === 'difficulty' || key === 'duration') {
          conditions[key] = { [Op.gte]: whereObjIncludes[key] }
        } else {
          conditions[key] = { [Op.iLike]: `%${whereObjIncludes[key]}%` }
        }
      };
    });
    if (Object.keys(conditions).length === 0) return null;
    return conditions;
  },

  findDB: async function(cond = null, model = null) {
    const arr = await Country.findAll({
      where: cond,
      include: {
        model: Activities
      }
    })
    if (arr.length === 0) throw new Error('No se encontró ninguna pais con esos términos');
    return arr
  },
  findActivity: async function(cond = null) {
    const arr = await Activities.findAll({
      where: cond,
      include: {
        model: Country,/* 
        attributes: ["CountryCca3"] */
      }
    })
    if (arr.length === 0) throw new Error('No se encontró ninguna actividad');
    return arr
  },
  createPaises: async function(array) {
    for (let i = 0; i < array.length; i++) {
      const pais = array[i];
      const arr = await Country.findAll({ where: { cca3: pais.cca3, name: pais.name, } })
      if (arr.length > 0)
        throw new Error('Porlomenos uno de los paises ya existe: nombre:' + pais.name + '  cca3:' + pais.cca3);
    }
    await Country.bulkCreate(array)
    return { Sucess: 'Se han creado los paises exitosamente' }
  },

  createActivity: async (body) => {
    const data = []

    for (const ele of body) {

      const arr = await Activities.findOne({ where: { name: ele.name } })

      if (arr)
        throw new Error('Porlomenos uno de las actividades ya existe: id:' + ele.name);
      data.push({ ...ele, duration: parseInt(ele.duration), difficulty: parseInt(ele.difficulty) })
    }
    await Activities.bulkCreate(data)
    return data

  },
  //const data = 
  countryByCCA3: async (cca3) => {
    return await Country.findByPk(cca3.toUpperCase(), {
      include: [{
        model: Activities,
      }],
    })
  },
  activityByCCA3: async (id) => {
    return await Activities.findByPk(id)
  },
  activityByName: async (name) => {
    return await Activities.findOne({
      where: { name: name },
    })
  },

  contarPaises: async (whereCond = null, whereCondActi = null) => {
    const count = await Country.count({
      where: whereCond,
      include: [{
        model: Activities,
        where: whereCondActi,
      }],
    })
    if (!count)
      throw new Error('No es encontró ningún pais que matchee');
    return count
  },
  filtrarPaises: async (page, whereCond = null, whereCondActi = null, orden = [['cca3', 'ASC']]) => {
    page = parseInt(page)
    if (page < 1) page = 1; //evita el 0 y negativos
    let limit = 10
    let offset = (page - 1) * limit - 1
    if (page === 1) {
      limit = 9
      offset = 0
    }
    const found = await Country.findAll({
      where: whereCond,
      include: [{
        model: Activities,
        where: whereCondActi,
        attributes: ['id', 'name', 'difficulty', 'season', 'duration']
      }],
      offset,
      limit,
      order: orden
    })
    if (!found)
      throw new Error('No es encontró ningún pais que matchee');
    return found
  },

  getAll: async (whereCond = null, whereCondActi = null, orden = [['cca3', 'ASC']]) => {
    const found = await Country.findAll({
      where: whereCond,
      include: [{
        model: Activities,
        where: whereCondActi,
        attributes: ['id', 'name', 'difficulty', 'season', 'duration']
      }],
      order: orden
    })
    if (!found)
      throw new Error('No es encontró ningún pais que matchee');
    return found
  },

  findAll: async (whereCond = null, whereCondActi = null, body) => {
    let limit = null
    let offset = null
    if (body.page !== null) {
      if (body.page < 1) body.page = 1; //evita el 0 y negativos
      limit = 10
      offset = (body.page - 1) * limit - 1
      if (body.page === 1) { //primera pagina
        limit = 9
        offset = 0
      }
    }
    const found = await Country.findAll({
      where: whereCond,
      include: [{
        model: Activities,
        where: whereCondActi,
        attributes: ['id', 'name', 'difficulty', 'season', 'duration']
      }],
      order: body.orden,
      limit,
      offset,
    })
    if (!found)
      throw new Error('No se encontró ningún pais que matchee');
    return found
  },


  assignActivities: async (reqbody) => {
    for (const id of reqbody[1]) {
      const actividad = await Activities.findByPk(id)
      if (!actividad)
        throw new Error('La actividad no existe: id=' + id)
    }
    for (const cca3 of reqbody[0]) {
      const pais = await Country.findByPk(cca3.toUpperCase())
      if (!pais)
        throw new Error('El pais con cca3=' + cca3 + ' no existe')
      await pais.addActivities(reqbody[1])
        .catch(arr => {
          throw new Error("El pais con cca3=" + cca3 + " ya tiene una de las actividades")
        })
    }
  }
}
