const Command = require('../../utils/base/Command.js')

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

    async execute (message, args, client){
        if (!args[0]) return message.reply('Insira a quantidade de mensagens que você quer limpar!')

        const permissionErrorEmbed = await client.defaultEmbed.getPermissionError(
            '*Verifique se você ou o bot possui a permissão:*',
            '`MANAGE_MESSAGES`'
        )

        permissionErrorEmbed.setColor(client.colors['default'])
        permissionErrorEmbed.setFooter(client.getFooter(message.guild))

        if (!message.member.permissions.has('MANAGE_MESSAGES'))
            return message.channel.send({ embeds: [permissionErrorEmbed] })

        let deletedCount = 0
        if (args[0].toLowerCase() === 'all') {
            let remainingMessages = 0
            do {
                await message.channel.bulkDelete(99, true).then(deletedMessages => {
                    remainingMessages = deletedMessages.size
                    deletedCount += remainingMessages
                })
            }
            while (remainingMessages != 0)
        }
        else {
            if (isNaN(args[0])) return message.reply('Insira apenas números!')
            if (args[0] >= 100 || args[0] < 1) return message.reply('So é possível deletar de 1 a 99 mensagens!')

            await message.channel.bulkDelete(++args[0], true).then(deletedMessages => {
                deletedCount += deletedMessages.size
            })
        }
        message.channel.send(`${message.author} ` + deletedCount + ' mensagens limpadas com sucesso! 👍').then(msg => {
            setTimeout(() => msg.delete(), 3000)
        })
    }
}

module.exports = Clear
