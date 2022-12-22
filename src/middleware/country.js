const { Router } = require("express");
const { Country, conn } = require("../db");
const router = Router();
const { fetchApi, findDB, getWhereConditions, createPaises, filtrarPaises, getWhereConditionsActivities, getAll, contarPaises } = require("../controllers");
const { validateQuery, validateBodyForBulk, validateCountry, validateString, validateCCA3, validatePageRoute } = require("../validators");

let localDb = false //vacío para que ten ga .length desde que se inicia el sv
async function initialCheck() {
  try {
    await findDB().then(resp => {
      if (resp.length > 0)
        localDb = true
    })
  } catch (err) {
    console.log(err)
  }
}
initialCheck()

router.get("/getall", async (req, res) => {
  try {
    // if (!localDb) return res.send({ Sucess: [] });
    const { whereObj, whereObjIncludes, orden } = validatePageRoute({ pgnumber: 1 }, req.query, req.body)
    let whereCond = null, whereCondActi = null
    if (whereObj && Object.keys(whereObj).length > 0) {
      validateString(whereObj)
      validateQuery(whereObj)
      whereCond = getWhereConditions(whereObj)
    }
    if (whereObjIncludes && Object.keys(whereObjIncludes).length > 0) {
      console.log('if pasado');
      console.log(whereObjIncludes);
      whereCondActi = getWhereConditionsActivities(whereObjIncludes)
      console.log(whereObjIncludes);
      console.log(whereCondActi);
    }
    const found = await getAll(whereCond, whereCondActi, orden)
    const count = await contarPaises(whereCond, whereCondActi)
    return res.status(200).send({ Sucess: found, Results: count })

  } catch (error) {
    return res.status(404).send({ Error: error.message })
  }
})

router.get("/page/:pgnumber", async (req, res) => {
  try {
    // if (!localDb) return res.send({ Sucess: [] });
    const { page, whereObj, whereObjIncludes, orden } = validatePageRoute(req.params, req.query, req.body)
    let whereCond = null, whereCondActi = null
    if (whereObj && Object.keys(whereObj).length > 0) {
      validateString(whereObj)
      validateQuery(whereObj)
      whereCond = getWhereConditions(whereObj)
    }
    if (whereObjIncludes && Object.keys(whereObjIncludes).length > 0) {
      console.log('if pasado');
      console.log(whereObjIncludes);
      whereCondActi = getWhereConditionsActivities(whereObjIncludes)
      console.log(whereObjIncludes);
      console.log(whereCondActi);
    }
    const found = await filtrarPaises(page, whereCond, whereCondActi, orden)
    const count = await contarPaises(whereCond, whereCondActi)
    return res.status(200).send({ Sucess: found, Results: count })

  } catch (error) {
    return res.status(404).send({ Error: error.message })
  }
})
router.post('/create', async (req, res) => {
  try {
    validateBodyForBulk(req.body)
    for (const pais of req.body) { validateString(pais), validateCountry(pais) }
    const data = await createPaises(req.body)
    return res.status(200).send(data)
  } catch (error) {
    return res.status(501).send({ Error: error.message })
  }
})
router.get('/', async (req, res, next) => {
  try {
    if (localDb) {
      if (localDb && Object.keys(req.query).length > 0) next();
      else {
        const data = await findDB()
        return res.status(200).send({ Sucess: data })
      }
    } else {
      await fetchApi()
      const data = await findDB()
      localDb = true;
      console.log('finalizado. A partir de ahora se usara una DB propia')
      return res.status(200).send({ Sucess: data })
    }
  } catch (arror) {
    return res.status(501).send({ error: arror, message: arror.message })
  }
},
  async (req, res) => {
    try {
      validateString(req.query)
      validateQuery(req.query)
      const conditions = getWhereConditions(req.query)
      const data = await findDB(conditions)
      return res.status(200).send({ Sucess: data })
    } catch (error) {
      return res.status(404).send({ Error: error.message })
    }
  });

router.get('/:idpais', async (req, res) => {
  try {
    validateString(req.params)
    validateCCA3(req.params.idpais)
    const data = await Country.findByPk(req.params.idpais.toUpperCase())
    if (data)
      return res.status(200).send({ Sucess: data });
    else return res.status(404).send({ Error: 'No se encontró un país con el cca3: ' + req.params.idpais.toUpperCase() })
  } catch (err) {
    return res.status(501).send({ Error: err.message })
  }
});

module.exports = router;
