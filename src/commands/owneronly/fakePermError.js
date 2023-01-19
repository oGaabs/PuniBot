const Command = require('../../utils/base/Command.js')

class FakePermError extends Command {
    constructor(client) {
        super(client, {
            name: 'fakePermError',
            aliases: ['fakepermissionerr','getfakepermissionembed', 'permerr','permembed'],
            description: 'Gerar erro de permissão!',
            category: 'ownerOnly'
        })
    }

    async execute (message, _args, client){
        const botOwner = client.botOwner
        const permissionErrorEmbed = await client.defaultEmbed.getPermissionError(
            '*Verifique se você ou o bot possui a permissão:*',
            '`MANAGE_MESSAGES`'
        )

        permissionErrorEmbed.setColor(client.colors['default'])
        permissionErrorEmbed.setFooter(client.getFooter(message.guild))

        if (message.author.id !== botOwner.id) return message.channel.send({ embeds: [permissionErrorEmbed] })

        client.logger.warn('[DEBUG] ::', 'Erro de permissão solicitado pelo Dono\n', true)
        message.channel.send({ embeds: [permissionErrorEmbed] })
    }
}

module.exports = FakePermError