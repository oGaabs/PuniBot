const { MessageEmbed } = require('discord.js')
module.exports ={
    name: 'clear',
    description: "Limpa as mensagens!",
    args: '(qtdMensagens)',
    async execute(message, args, client) {
        if (!args[1]) return message.reply('Insira a quantidade de mensagens que você quer limpar!')
        if (!args[1].toLowerCase() === 'all' && isNaN(args[1])) return message.reply('Insira apenas números!')
        if (args[1] >= 100 || args[1] < 1) return message.reply('So é possível deletar de 1 a 99 mensagens!')

        const permissionErrorEmbed = new MessageEmbed()
            .setTitle('**Erro:**', true)
            .setColor('#9B59B6')
            .addField('*Verifique se você possui a permissão:*', '`MANAGE_MESSAGES`', true)
            .setDescription('Missing Permissions')
            .setTimestamp()
            .setFooter(client.footer)
        if (!message.member.permissions.has('MANAGE_MESSAGES'))
            return message.channel.send({ embeds: [permissionErrorEmbed] })
        const author = message.author
        if (args[1].toLowerCase() === 'all') {
            let countMsg = 0
            while (true) {
                const fetch = await message.channel.messages.fetch({limit: 99})
                if (fetch.size == 0)
                    return message.channel.send(`${author} ` + countMsg + ' mensagens limpadas com sucesso! 👍').then(msg => {
                        setTimeout(() => msg.delete(), 3000)
                    })
                countMsg += fetch.size
                await message.channel.bulkDelete(fetch)
            }
        }
        await message.channel.messages.fetch({limit: ++args[1]}).then(messages =>{
            args[1] = messages.size
            message.channel.bulkDelete(messages)
        })
        return message.channel.send(`${author} ` + args[1] + ' mensagens limpadas com sucesso! 👍').then(msg => {
            setTimeout(() => msg.delete(), 3000)
        })
    }
}
