module.exports = {
    name: 'fakePermError',
    aliases: ['fakepermissionerr','getfakepermissionembed', 'permembed'],
    description: 'Gerar erro de permissão!',
    execute: async (message, _args, client) => {
        const botOwner = client.botOwner
        const permissionErrorEmbed = await client.defaultEmbed.getPermissionError(
            '*Verifique se você ou o bot possui a permissão:*',
            '`MANAGE_MESSAGES`'
        )

        permissionErrorEmbed.setColor(client.colors['default'])
        permissionErrorEmbed.setFooter(client.getFooter(message.guild))

        if (message.author.id !== botOwner.id) return message.channel.send({ embeds: [permissionErrorEmbed] })

        client.logger.warn('[DEBUG] ::', 'Erro de permissão solicitado pelo Dono\n')
        message.channel.send({ embeds: [permissionErrorEmbed] })
    }
}
