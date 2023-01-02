
const axios = {
  get: async (url) => {
    const fetchRes = await fetch(url)
    const apiUrl = await fetchRes.json()
    return {data: apiUrl}
  }
}
const fetchApi = async function () {
  const apiUrl = await axios.get("https://pokeapi.co/api/v2/pokemon/")
  const apiNext = await axios.get(apiUrl.data.next)
  const pokemonApi = [...apiUrl.results, ...apiNext.results]
  const arrayDePromesas = pokemonApi.map(ele => { return axios.get(ele.url) })
  await Promise.all(arrayDePromesas).then(res2 => {
    //res2 es un array de datos de pokemones
    pokemonApi.forEach((obj, i) => {
      obj.detalles = res2[i]
    })
  })
  return pokemonApi
}

async function tta(req, res) {
  try {
    const apiData = await axios.get(
      //`https://api.rawg.io/api/games?key=${API_KEY}`
      "https://api.rawg.io/api/games?key=8909c4c4e3904da2aef025d184f45f79"
    );
    const apiGames = await apiData.results.map((e) => {
      return {
        id: e.id,
        name: e.name,
        description: e.description,
        released: e.released,
        image: e.background_image,
        rating: e.ratings,
        plattforms: e.platforms.map((p) => p.platform.name ),
        genres: e.genres.map((g) => g.name),
      };
    })
    return (apiGames)

  } catch (error) {
    return (error.message)
  }
}
async function inicio(input) {
  const apiGames = await tta()
  console.log(apiGames)
};

inicio()
