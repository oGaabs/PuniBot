const Command = require('../../utils/base/Command.js')

class FreeGamesRequest extends Command {
    constructor(client) {
        super(client, {
            name: 'free',
            aliases: ['freegames', 'fgames', 'games', 'gratis',
                'steam', 'epicgames', 'epic', 'f'],
            description: 'Send free games!',
            category: 'outros'
        })
    }

    async execute (message, _args, _client){
        const freeGames = require(process.cwd() + '/listeners/freeGamesReddit.js')
        freeGames.sendGames(message.channel.id)
    }
}

module.exports = FreeGamesRequest

