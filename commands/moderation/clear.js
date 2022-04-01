const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'clear',
    aliases: ['limpar', 'excluir', 'deletar',
        'del', 'cl'],
    description: 'Limpa as mensagens!',
    args: '(qtdMensagens)',
    execute: async (message, args, client) => {
        if (!args[0]) return message.reply('Insira a quantidade de mensagens que você quer limpar!')

        const permissionErrorEmbed = new MessageEmbed()
            .setTitle('**Erro:**', true)
            .setColor(client.getColor('default'))
            .addField('*Verifique se você possui a permissão:*', '`MANAGE_MESSAGES`', true)
            .setDescription('Missing Permissions')
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()
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
