const { Router } = require("express");
const { findActivity, createActivity, assignActivities, findDB, filtrarPaisesPorActividad } = require("../controllers")
const { validateBodyActivities, validateAssignBody, validatePageRouteActividad } = require("../validators")

const router = Router();

router.get("/page/:pgnumber", async (req, res) => {
  // if (!localDb) res.redirect('/countries');
  try {
    const page = req.params.pgnumber
    const actividad = req.body
    validatePageRouteActividad(page, actividad)
    const found = await filtrarPaisesPorActividad(page, actividad)
    res.send({ Sucess: found })

    /* 
  [ ] Filtrar por tipo de actividad turística
- [ ] para ordenar tanto ASC como DESC los países: 
      por orden alfabético
      por cantidad de población
      */

  } catch (error) {
    res.status(404).send({ Error: error.message })
  }
})


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

router.post("/assign", async (req, res) => {
  //TODO: que venga un array de IDs de paises y un array de IDs de actividades
  try {
    validateAssignBody(req.body)
    await assignActivities(req.body)
    res.send({ Sucess: 'Actividad(es) asignadas correctanemte' })
  } catch (err) {
    res.status(501).send(err.message)
  }
})

module.exports = router;
