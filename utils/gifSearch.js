const nodeFetch = require('node-fetch')

module.exports = {
    getGif: async function (searchTerm) {
        // Considerando os Termos de Serviços do Discord, utilizamos um filtro do TenorAPI para encontrar os gifs,
        // que está conforme a PG-13: Pais fortemente alertados, alguns materiais podem ser impróprios
        // para crianças menores de 13 anos, em que 13 é a idade minima para usar o Discord no Brasil.
        const response = await nodeFetch(`https://g.tenor.com/v1/search?q=${searchTerm}&key=${process.env.TENORKEY}&contentfilter=low&media_filter=minimal`)
            .then(res => res.json())
        const gifPost = response.results[Math.floor(Math.random() * response.results.length)]
        return { image: gifPost.media[0].gif.url, url: gifPost.url }
    }
}
