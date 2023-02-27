const axios = require('axios')

const instance = axios.create({
    baseURL: 'https://api.openai.com/v1/completions',
    headers: {
        Authorization: `Bearer ${process.env.CHATGPT3KEY}`
    }
})

module.exports = instance