const { API_URL } = require('./constantes')
async function obtenerAPI() {
  const res = await fetch(API_URL)
  const data = await res.json()
  return data
}

async function start() {
  const data = await obtenerAPI()
  console.log(data.map(element => element['ccn3']))
}

start()