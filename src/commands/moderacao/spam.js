const Command = require('../../utils/base/Command.js')

const { PermissionsBitField: { Flags: PERMISSIONS } } = require('discord.js')

class Spam extends Command {
    constructor(client) {
        super(client, {
            name: 'spam',
            aliases: ['flodar', 'floodar', 'flood', 'fl', 'sp'],
            description: 'Spam de Mensagens!',
            category: 'moderação',
            args: '(qtdMensagens)'
        })
    }

    async execute(message, args, client) {
        if (!args[0]) return message.reply('Insira a quantidade de mensagens que você quer spammmr!')
        if (isNaN(args[0])) return message.reply('Insira apenas números!')
        if (args[0] > 30 || args[0] < 1) return message.reply('So é possível spammar de 1 a 30 mensagens!')

        const permissionErrorEmbed = await client.defaultEmbed.getPermissionError(
            '*Verifique se você ou o bot possui a permissão:*',
            '`ADMINISTRATOR`'
        )

        permissionErrorEmbed.setColor(client.colors['default'])
        permissionErrorEmbed.setFooter(client.getFooter(message.guild))

        if (!message.member.permissions.has(PERMISSIONS.Administrator))
            return message.channel.send({ embeds: [permissionErrorEmbed] })
        let spamCount = 0
        while (spamCount < args[0]) {
            await message.channel.messages.fetch({ limit: spamCount + 1 }).then(messages => {
                messages.map((msg) => {
                    if (msg.content === 'stop' && msg.author === message.author)
                        spamCount = args[0]
                })
            })
            await message.channel.send((Math.random() + 1).toString(36).substring(7))
            spamCount++
        }
        message.reply('Spam realizado com sucesso! 👍')
    }
}

module.exports = Spam

