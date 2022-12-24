const { Router } = require("express");
const router = Router();
const validate = require("../validators");
const controllers = require("../controllers")

let localDb = false
async function initialCheck() {
  try {
    await controllers.findDB().then(resp => {
      if (resp.length > 0)
        localDb = true
    })
  } catch (err) {
    console.log(err)
  }
}
initialCheck()


//crea paises a partir de un array de paises
router.post('/create', async (req, res) => {
  try {
    validate.validateBodyForBulk(req.body)
    for (const pais of req.body) { validate.validateString(pais), validate.validateCountry(pais) }
    const data = await controllers.createPaises(req.body)
    return res.status(200).send({ sucess: true, message: "Pais/es creado/s exitosamente", found: data.length, data: data })
  } catch (error) {
    return res.status(501).send({ sucess: false, message: error.message, found: data.length, data: error.message })
  }
})
router.get('/', async (req, res, next) => {
  try {
    if (localDb) {
      const body = validate.countriesBody(req.body)
      const { whereObj, whereObjIncludes } = validate.countriesQuery(req.query)
      let whereCond = null, whereCondActi = null
      if (whereObj && Object.keys(whereObj).length > 0) //escalable
        whereCond = controllers.getWhereConditions(whereObj)
      if (whereObjIncludes && Object.keys(whereObjIncludes).length > 0)//escalable
        whereCondActi = controllers.getWhereConditionsActivities(whereObjIncludes)
      const data = await controllers.findAll(whereCond, whereCondActi, body)
      return res.status(200).send({ sucess: true, message: "Se han encontrado " + data.length + " resultados", found: data.length, data: data })
    } else {
      await controllers.fetchApi()
      const data = await controllers.findDB()
      localDb = true;
      console.log('finalizado. A partir de ahora se usara una DB propia')
      return res.status(200).send({ sucess: true, message: "Se ha rellenado la DB postgres countries exitosamente", found: data.length, data: data })
    }
  } catch (arror) {
    const data = []
    return res.status(501).send({ sucess: false, message: "Error interno: " + arror.message, found: data.length, data: [] })
  }
});

router.get('/:idpais', async (req, res) => {
  try {
    validate.validateString(req.params)
    validate.validateCCA3(req.params.idpais)
    const data = await controllers.countryByCCA3(req.params.idpais)
    if (data)
      return res.status(200).send({ sucess: true, message: data.length + "País encontrado", found: data.length, data: [data] });
    else return res.status(404).send({ sucess: false, message: `No se encontró un país con el cca3:  ${req.params.idpais.toUpperCase()}`, found: data.length, data: [] })
  } catch (err) {
	  const data=[]
    return res.status(501).send({ sucess: false, message: err.message, found: data.length, data: [] })
  }
});

module.exports = router;
