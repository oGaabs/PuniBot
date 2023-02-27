const axios = require('axios')

const instance = axios.create({
    baseURL: 'https://dicio-api-ten.vercel.app/v2/',
    timeout: 10000
})

module.exports = instance