const axios = require('axios')
const apiCountriesClean = country => {
  return {
    id: country.cca3,
    name: country.name,
    bandera: country.flags.png,
    capital: country.capital ? country.capital[0] : 'Sin capital',
    subregion: country.subregion,
    continente: country.region,
    area: country.area,
    poblacion: country.population
  }
}

const bulkCreateCountries = async () => {
  let response = await fetch("https://restcountries.com/v3.1/all")
  let apiCountries = await response.json()
  let result = apiCountries.map((country) => {
    return apiCountriesClean(country)
  })
  console.log(result);
  return result
}
bulkCreateCountries()


