const nodeFetch = require('node-fetch')

module.exports = {
    getGif: async function (searchTerm) {
        const response = await nodeFetch(`https://g.tenor.com/v1/search?q=${searchTerm}&key=${process.env.TENORKEY}&ContentFilter=high`)
            .then(res => res.json())
        const gifPost = response.results[Math.floor(Math.random() * response.results.length)]
        return { image: gifPost.media[0].gif.url, url: gifPost.url }
    }
}