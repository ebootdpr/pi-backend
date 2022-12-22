const { Router } = require("express");
const { findActivity, createActivity, assignActivities, findDB } = require("../controllers")
const { validateBodyActivities, validateAssignBody } = require("../validators")

const { Country, Op, conn, Activities } = require("../db");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const resp = await findActivity(null)
    res.send({ Sucess: resp })
  } catch (error) {
    res.status(404).send({ Error: error.message })
  }
})
router.post("/", async (req, res) => {
  try {
    validateBodyActivities(req.body)
    const data = await createActivity(req.body)
    res.send({ Sucess: data })
  } catch (error) {
    res.status(404).send({ Error: error.message })
  }
});
router.delete("/", async (req, res) => {
  try {
    const selectedPais = await Country.findByPk(req.query.cca3)
    const selectedActivity = await Activities.findByPk(req.query.id)
    const removed = await selectedPais.removeActivities(selectedActivity)
    if(!removed) throw new Error('No se eliminó esa actividad del pais indicado')
    res.status(200).send({ Sucess: removed, })

  } catch (error) {
    res.status(501).send({ Error: error.message })
  }
})
router.delete("/all", async (req, res) => {
  try {
    const idactividad = req.query.id
    const row = await Activities.findOne({
      where: { id: idactividad },
    })
    if (!row) return res.status(404).send({ Error: 'No se encontró esa actividad' })
    row.destroy().then(asd => {
      res.status(200).send({ Sucess: asd })
    })
  } catch (error) {
    res.status(501).send({ Error: error.message })
  }
})

router.put("/", async (req, res) => {
  //TODO: que venga un array de IDs de paises y un array de IDs de actividades
  try {
    validateAssignBody(req.body)
    await assignActivities(req.body)
    res.send({ Sucess: 'Actividad(es) asignadas correctanemte' })
  } catch (error) {
    res.status(501).send({ Error: error.message })
  }
})

module.exports = router;
