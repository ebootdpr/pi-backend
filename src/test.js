const axios = require('axios')
const validCountryAtts = ['cca3', 'name', 'flags', 'continents', 'capital', 'subregion', 'area', 'population']

const fetchApi = async function () {
  const response = await axios.get("https://restcountries.com/v3/all")
  const DB = response.data
  console.log(DB)
  const dbFiltrada = filtrarArray(DB)
  await fillCountries(dbFiltrada)
}
async function fillCountries(input) {
  const promesas = input.map(async ele => {
    if (ele.cca3) {
      const found = await Country.findOne({ where: { cca3: ele.cca3 } });
      if (found) throw new Error('id existente');
      return Country.create({
        name: 'Sin nombre',
        flags: 'https://pixy.org/src/46/467785.png',
        continents: 'Other',
        capital: 'Sin capital',
        subregion: 'Sin subregion',
        ...ele
      })
    }
  })
  await Promise.all(promesas)
};
function CheckeoRecursivo(input) {
  if (typeof input !== 'object') {
    return input
  }
  return CheckeoRecursivo(input[Object.keys(input)[0]])
};

function filtrarArray(DB) {
  return DB.map(ele => {
    const obj = {}
    validCountryAtts.forEach(str => {
      if (ele[str]) {
        obj[str] = CheckeoRecursivo(ele[str])
      }
    })
    return obj
  })
};
