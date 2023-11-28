const Command = require('../../utils/base/Command.js')
const Guild = require('../../core/database/models/guild.js')

class SetFreeGamesChannel extends Command {
    constructor(client) {
        super(client, {
            name: 'free',
            aliases: ['fchannel', 'fgames', 'games', 'gratis',
                'steam', 'epicgames', 'epic', 'f'],
            description: 'Set free games channel!',
            category: 'outros'
        })
    }

    async execute(message, _args, _client) {
        const guild = message.guild
        const channel = message.channel
        if (!guild || !channel) return

        const alreadyRegistered = await Guild.findOne({ guildId: guild.id, freeGamesChannelId: channel.id })
        if (alreadyRegistered) {
            await Guild.updateOne({ guildId: guild.id }, { freeGamesChannelId: null })
            return await channel.send('Free games channel removed!')
        }

        await Guild.updateOne({ guildId: guild.id, freeGamesChannelId: channel.id })
        await channel.send('Free games channel set!')
    }
}

module.exports = SetFreeGamesChannel

