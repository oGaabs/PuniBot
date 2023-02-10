const Command = require('../../utils/base/Command.js')

const { EmbedBuilder, PermissionsBitField: { Flags: PERMISSIONS } } = require('discord.js')

class Fake extends Command {
    constructor(client) {
        super(client, {
            name: 'fake',
            aliases: ['fakear', 'troll', 'messagebot'],
            description: 'Fakear um usuario e mensagem!',
            category: 'moderação',
            args: '(Usuario) (Canal) (Mensagem) '
        })
    }

    async execute(message, args, client, isUsedByOtherCommand) {
        const permissionErrorEmbed = await client.defaultEmbed.getPermissionError(
            '*Verifique se você ou o bot possui a permissão:*',
            '`ADMINISTRATOR`'
        )

        permissionErrorEmbed.setColor(client.colors['default'])
        permissionErrorEmbed.setFooter(client.getFooter(message.guild))

        if (!isUsedByOtherCommand && !message.member.permissions.has(PERMISSIONS.Administrator))
            return message.channel.send({ embeds: [permissionErrorEmbed] })

        const userToFake = message.mentions.users.first()
        if (!userToFake) return message.channel.send(`Você precisa mencionar um usuário! ${client.prefix} fake ${this.args}`)

        const messageToFake = args.slice(2).join(' ')
        if (messageToFake.length < 1) return message.channel.send(`Você precisa digitar uma mensagem! ${client.prefix} fake ${this.args}`)

        const channelToSend = message.mentions.channels.first() ?? message.channel

        const fakeData = {
            name: userToFake.username,
            avatar: userToFake.displayAvatarURL({ format: 'png' }),
            channel: channelToSend,
            message: messageToFake
        }

        if (message.content.startsWith(client.prefix + ' messageBot')) {
            this.sendEmbedMessage(fakeData, channelToSend)
            return message.delete()
        }

        this.createWebhook(fakeData, channelToSend)
            .then(async webhook => {
                webhook.send(fakeData.message)
                message.delete()
            })
    }

    createWebhook(fakeData, channelToSend) {
        return channelToSend.createWebhook({ name: fakeData.name, avatar: fakeData.avatar })
    }

    async sendEmbedMessage(fakeData, channelToSend) {
        const botEmbed = new EmbedBuilder()
            .setDescription(`**${fakeData.message}**`)

        this.createWebhook(fakeData, channelToSend).then(async webhook => webhook.send({
            embeds: [botEmbed],
        }))
    }
}

module.exports = Fake
