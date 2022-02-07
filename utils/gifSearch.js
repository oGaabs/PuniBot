const nodeFetch = require('node-fetch')

module.exports = {
    getGif: async function(searchTerm) {
        const response = await nodeFetch(`https://g.tenor.com/v1/search?q=${searchTerm}&key=${process.env.TENORKEY}&ContentFilter=high`)
        const json = response.json()

        const gifPost = json.results[Math.floor(Math.random() * json.results.length)]
        return { image: gifPost.media[0].gif.url, url: gifPost.url }
    },
}