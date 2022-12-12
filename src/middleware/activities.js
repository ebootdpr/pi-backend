const { Router } = require("express");
const { findActivity, createActivity } = require("../controllers")
const { validateBodyActivities } = require("../validators")

const router = Router();

router.post("/", async (req, res) => {
  try {
    validateBodyActivities(req.body)
    const data = await createActivity(req.body)
    res.send({ Sucess: data })
  } catch (error) {
    res.status(404).send({ Error: error.message })
  }


});
router.get("/", (req, res) => {
  /* 
 Nombre
 Dificultad (Entre 1 y 5)
 Duración
 Temporada (Verano, Otoño, Invierno o Primavera) */
 res.send({Error: 'Solo se aceptan post por ahora'})
  try {

  } catch (err) {
    res.status(501).send(err.message)
  }
})

module.exports = router;
