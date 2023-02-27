const axios = require('axios')

const instance = axios.create({
    baseURL: 'https://g.tenor.com/v1/',
    params: {
        contentfilter: 'low',
        media_filter: 'minimal',
        key: process.env.TENORKEY
    }
})

module.exports = instance