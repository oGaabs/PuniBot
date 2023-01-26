const Command = require('../../utils/base/Command.js')

const { PermissionsBitField: { Flags: PERMISSIONS }, inlineCode } = require('discord.js')

class Clear extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            aliases: ['limpar', 'excluir', 'deletar',
                'del', 'cl'],
            description: 'Limpa as mensagens!',
            category: 'moderação',
            args: '(qtdMensagens)'
        })
    }



    async execute(message, args, client) {
        if (!args[0]) return message.reply('Insira a quantidade de mensagens que você quer limpar!')

        const permissionErrorEmbed = await client.defaultEmbed.getPermissionError(
            '*Verifique se você ou o bot possui a permissão:*',
            inlineCode(PERMISSIONS.ManageMessages)
        )

        permissionErrorEmbed.setColor(client.colors['default'])
        permissionErrorEmbed.setFooter(client.getFooter(message.guild))

        if (!message.member.permissions.has(PERMISSIONS.ManageMessages))
            return message.channel.send({ embeds: [permissionErrorEmbed] })

        let deletedCount = 0
        if (args[0].toLowerCase() === 'all') {
            deletedCount = await this.clearAllMessagesInChannel(message.channel)
        }
        else {
            if (isNaN(args[0])) return message.reply('Insira apenas números!')

            let quantityToDelete = parseInt(args[0])

            if (quantityToDelete >= 100 || quantityToDelete < 1)
                return message.reply('So é possível deletar de 1 a 99 mensagens!')

            deletedCount = await this.clearMessagesInChannel(quantityToDelete, message.channel)
        }

        const msg = await message.channel.send(`${message.author} ` + deletedCount + ' mensagens limpadas com sucesso! 👍')
        setTimeout(() => msg.delete(), 3000)
    }

    async clearAllMessagesInChannel(channel) {
        let deletedCount = 0
        let alreadyDeleted = 0
        do {
            await channel.bulkDelete(100, true).then(deletedMessages => {
                alreadyDeleted = deletedMessages.size
                deletedCount += alreadyDeleted
            })
        }
        while (alreadyDeleted != 0)

        return deletedCount
    }

    async clearMessagesInChannel(quantity, channel) {
        let deletedCount = 0
        await channel.bulkDelete(++quantity, true).then(deletedMessages => {
            deletedCount = deletedMessages.size
        })

        return deletedCount
    }
}

module.exports = Clear
