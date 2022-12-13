const { Router } = require("express");
const { Country, conn } = require("../db");
const router = Router();
const { fetchApi, findDB, getWhereConditions, createPaises, filtrarPaises } = require("../controllers");
const { validateQuery, validateBodyForBulk, validateCountry, validateString, validateCCA3, validatePageRoute } = require("../validators");

function OK(data, res) {
  res.status(200).send({ Sucess: data })
}
function NOTFOUND(data, res) {
  res.status(404).send({ Error: data.message })
}


let localDb = false //vacío para que ten ga .length desde que se inicia el sv

router.get('/reset', async (req, res) => {
  await conn.sync({ force: true })
  Country.findAll().then(resp => {
    res.status(200).send(resp)
  })

})
//TODO: paginacion
//TODO: 
router.get("/page/:pgnumber", async (req, res) => {
  // if (!localDb) res.redirect('/countries');
  try {
    const page = req.params.pgnumber
    const filtros = req.query
    const orden = req.body
    validatePageRoute(page, orden)
    let conditions = null
    if (Object.keys(filtros).length > 0) {
      validateString(filtros)
      validateQuery(filtros)
      conditions = getWhereConditions(filtros)
    }
    const found = await filtrarPaises(page, conditions,orden  )
    res.send({ Sucess: found })

    /* 
  [ ] Filtrar 
      por continente y 
      por tipo de actividad turística
- [ ] para ordenar tanto ASC como DESC los países: 
      por orden alfabético
      por cantidad de población
- [ ] Paginado 
      10 paises por pagina
      primeros 9 en la primer pagina. 
      */

  } catch (error) {
    res.status(404).send({ Error: error.message })
  }
})
router.post('/create', async (req, res) => {
  try {
    validateBodyForBulk(req.body)
    for (const pais of req.body) { validateString(pais), validateCountry(pais) }
    const data = await createPaises(req.body)
    res.status(200).send(data)
  } catch (error) {
    res.status(501).send({ Error: error.message })
  }
})
router.get('/', async (req, res, next) => {
  try {
    if (localDb) {
      if (localDb && Object.keys(req.query).length > 0) next();
      else {
        const data = await findDB()
        OK(data, res)
      }
    } else {
      await fetchApi()
      const data = await findDB()
      OK(data, res);
      localDb = true;
      console.log('finalizado. A partir de ahora se usara una DB propia')
    }
  } catch (arror) {
    res.status(501).send({ error: arror, message: arror.message })
  }
},
  async (req, res) => {
    try {
      validateString(req.query)
      validateQuery(req.query)
      const conditions = getWhereConditions(req.query)
      const data = await findDB(conditions)
      OK(data, res)

    } catch (error) {
      NOTFOUND(error, res)
    }
  });

router.get('/:idpais', async (req, res) => {
  try {
    validateString(req.params)
    validateCCA3(req.params.idpais)
    const data = await Country.findByPk(req.params.idpais.toUpperCase())
    if (data) OK(data, res)
    else res.status(404).send({ Error: 'No se encontró un país con el cca3: ' + req.params.idpais.toUpperCase() })
  } catch (err) {
    res.status(501).send({ Error: err.message })
  }
});








/* router.put("/setCharacter", (req, res) => {
  const { idAbility, codeCharacter } = req.body;

  Ability.findByPk(idAbility)
    .then(ability => ability.setCharacter(codeCharacter))
    .then(ability => res.send(ability))
    .catch(error => res.status(400).send(error));
}); */

module.exports = router;
