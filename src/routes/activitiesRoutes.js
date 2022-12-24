const { Router } = require("express");
const controllers = require("../controllers")
const validate = require("../validators")
const { Country, Activities } = require("../db");

const router = Router();
router.get("/", async (req, res) => {
  try {
    const { whereObj, whereObjIncludes } = validate.countriesQuery(req.query)
    let whereCondActi = null
    if (whereObjIncludes && Object.keys(whereObjIncludes).length > 0)
      whereCondActi = controllers.getWhereConditionsActivities(whereObjIncludes)
    const data = await controllers.findActivity(whereCondActi)
    res.send({ sucess: true, message: "", found: data.length, data: data })
  } catch (error) {
    const data = []
    res.status(404).send({ sucess: false, message: " " + error.message, found: data.length, data: data })
  }
})


//? Crea activdades aprtiendo de un array de actividades 
router.post("/", async (req, res) => {
  try {
    validate.validateBodyActivities(req.body)
    const data = await controllers.createActivity(req.body)
    res.send({ sucess: true, message: data.length + " Actividad/es creada/s exitosamente.", found: data.length, data: data })
  } catch (error) {
    const data = []
    res.status(404).send({ sucess: false, message: " " + error.message, found: data.length, data: data })
  }
});


//? BOrra una actividad de 1 solo pais
router.delete("/", async (req, res) => {
  try {
    const selectedPais = await controllers.countryByCCA3(req.query.cca3)
    const selectedActivity = await controllers.activityByName(req.query.name)
    const result = await selectedPais.removeActivities(selectedActivity)

    if (!result) throw new Error('No se eliminó esa actividad del pais indicado')
    data = [result]
    res.status(200).send({ sucess: true, message: `El pais con ID: ${selectedPais} ya no tiene la actividad con ID: ${selectedActivity}`, found: data.length, data: data })

  } catch (error) {
    const data = []
    res.status(501).send({ sucess: false, message: "Error interno: " + error.message, found: data.length, data: data })
  }
})

//? Borra una actividad de todos los paises
router.delete("/all", async (req, res) => {
  try {
    const name = req.query.name
    const found = await controllers.activityByName(name)
    const data = []
    if (!found) return res.status(404).send({ sucess: false, message: 'No se encontró esa actividad', found: data.length, data: data })
    found.destroy().then(resp => {
      const data = [resp]
      res.status(200).send({ sucess: true, message: "Actividad borrada exitosamente.", found: data.length, data: data })
    })
  } catch (error) {
    const data = []
    res.status(501).send({ sucess: false, message: " " + error.message, found: data.length, data: data })
  }
})

router.put("/", async (req, res) => {
  //? creo que le asigna a un array de paises [0] un array de id de actividades [1]
  try {
    validate.validateAssignBody(req.body)
    await controllers.assignActivities(req.body)
    const data = []
    res.send({ sucess: true, message: 'Actividad(es) asignadas correctanemte', found: data.length, data: data })
  } catch (error) {
    const data = []
    res.status(501).send({ sucess: false, message: " " + error.message, found: data.length, data: data })
  }
})

module.exports = router;
