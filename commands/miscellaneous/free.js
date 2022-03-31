module.exports = {
    name: 'free',
    aliases: ['freegames', 'fgames', 'games', 'gratis',
        'steam', 'epicgames', 'epic', 'f'],
    description: 'Send free games!',
    execute: async (message, _args, _client) => {
        const freeGames = require(process.cwd() + '/listeners/freeGames.js')
        freeGames.sendGames(message.channel.id)
    }
}