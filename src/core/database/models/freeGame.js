const { Schema, model } = require('mongoose')

const freeGamesSchema = new Schema({
    title: String,
    url: String,
    permalink: String,
    domain: String,
    created: Number,
    created_utc: Number,
    hasSended: Boolean
})

const FreeGame = model('FreeGame', freeGamesSchema, 'freegames')

module.exports = FreeGame