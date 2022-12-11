const { Router } = require("express");
const { Country, Op, CountryKeys, conn } = require("../db");
const router = Router();
const { fetchApi, validateQuery } = require("../controllers");
const { API_URL } = require("../constantes");

function OK(data, res) {
  res.status(200).send(data)
}
function NOTFOUND(data, res) {
  res.status(404).send(data)
}


let localDb = false //vacío para que ten ga .length desde que se inicia el sv

router.get('/reset', async (req, res) => {
  await conn.sync({ force: true })
  Country.findAll().then(resp => {
    res.status(200).send(resp)
  })

})
//TODO: Hacer que por query pueda pasar CountryKeys
router.get('/', async (req, res, next) => {
  try {
    if (localDb) {
      if (localDb && req.query) next();
      else {
        const data = await Country.findAll()
        OK(data, res)
      }
    } else {
      const data = await fetchApi()
      OK(data, res); localDb = true; console.log('finalizado. A partir de ahora se usara una DB propia')
    }
  } catch (arror) {
    res.status(501).send({ error: arror, message: arror.message })
  }
},
  async (req, res) => {
    try {
      const conditions = validateQuery(req.query)
      console.log(conditions);

      if (Array.isArray(conditions)) return NOTFOUND({ Error: 'Query inválido, estos son los querys validos: ' + conditions }, res)
      const data = await Country.findAll({
        where: conditions
      })
      if (!data.length) return NOTFOUND({ Error: 'No se encontro ningun resultado' }, res)
      OK(data, res)

    } catch (error) {
      NOTFOUND(error, res)
    }
  });

router.get('/:idpais', async (req, res) => {
  try {
    const data = await Country.findByPk(req.params.idpais.toUpperCase())
    if (data) OK(data, res)
    else NOTFOUND({ Error: 'No se encontró un país con el id ' + req.params.idpais.toUpperCase() }, res)
  } catch (err) {
    res.status(501).send({ error: err, 'Error Interno': err.message })
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
