const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'spam',
    description: "Spam de Mensagens!",
    args: '(qtdMensagens)',
    execute: async (message, args, client) => {
        if (!args[1]) return message.reply('Insira a quantidade de mensagens que você quer spammmr!')
        if (isNaN(args[1])) return message.reply('Insira apenas números!')
        if (args[1] > 30 || args[1] < 1) return message.reply('So é possível spammar de 1 a 30 mensagens!')

        const permissionErrorEmbed = new MessageEmbed()
            .setTitle('**Erro:**', true)
            .setColor(client.getColor('default'))
            .addField('*Verifique se você possui a permissão:*', '`ADMINISTRATOR`', true)
            .setDescription('Missing Permissions')
            .setFooter(client.getFooter(message))
            .setTimestamp()
        if (!message.member.permissions.has('ADMINISTRATOR'))
            return message.channel.send({ embeds: [permissionErrorEmbed] })
        let spamCount = 0
        while (spamCount < args[1]) {
            await message.channel.messages.fetch({ limit: spamCount + 1 }).then(messages => {
                messages.map((msg) => {
                    if (msg.content === 'stop' && msg.author == message.author)
                        spamCount = args[1]
                })
            })
            await message.channel.send((Math.random() + 1).toString(36).substring(7))
            spamCount++
        }
        message.reply('Spam realizado com sucesso! 👍')
    }
}
