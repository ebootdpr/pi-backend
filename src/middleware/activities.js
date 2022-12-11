const { Router } = require("express");
const {pushActivitiesToDb} = require("../controllers")
const {validateBodyActivities}= require("../validators")

const router = Router();

router.get("/:pam", async (req, res) => {
 if(validateBodyActivities(req.body)){
  pushActivitiesToDb(req.body)
  res.send({Error: 'No implementado'})
 } else {
  res.send({Error: 'Esta parte no deberia ser accesible'})
 }
});
router.get("/",(req,res)=>{
 /* 
Nombre
Dificultad (Entre 1 y 5)
Duración
Temporada (Verano, Otoño, Invierno o Primavera) */
  try {

  } catch (err) {
   res.status(501).send(err.message)
  }
})

module.exports = router;
