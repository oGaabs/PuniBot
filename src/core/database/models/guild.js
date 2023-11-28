const { Schema, model } = require('mongoose')

const guildSchema = new Schema({
    guildId: String,
    guildName: String,
    prefix: String,
    welcomeChannelId: { type: String, required: false },
    goodbyeChannelId: { type: String, required: false },
    freeGamesChannelId: { type: String, required: false },
    registeredFreeGames: { type: Array, required: false }
})

const Guild = model('Guild', guildSchema, 'guilds')

module.exports = Guild