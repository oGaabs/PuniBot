module.exports = {
    name: 'fake',
    aliases: ['fakear', 'troll'],
    description: 'Fakear um usuario e mensagem!',
    category: 'moderação',
    args: '(Usuario) (Canal) (Mensagem) ',
    execute: async (message, args, client) => {
        const permissionErrorEmbed = await client.defaultEmbed.getPermissionError(
            '*Verifique se você ou o bot possui a permissão:*',
            '`ADMINISTRATOR`'
        )

        permissionErrorEmbed.setColor(client.colors['default'])
        permissionErrorEmbed.setFooter(client.getFooter(message.guild))

        if (!message.member.permissions.has('ADMINISTRATOR'))
            return message.channel.send({ embeds: [permissionErrorEmbed] })

        const userToFake = message.mentions.users.first()
        if (!userToFake) return message.channel.send('Você precisa mencionar um usuário!')

        const channelToSend = message.mentions.channels.first() ?? message.channel

        const messageToFake = args.slice(2).join(' ')
        if (messageToFake.length < 1) return message.channel.send('Você precisa digitar uma mensagem!')

        channelToSend.createWebhook(userToFake.username, { avatar: userToFake.displayAvatarURL({ format: 'png' }) }).then(async webhook => {
            webhook.send(messageToFake)
            message.delete()
        })
    }
}
