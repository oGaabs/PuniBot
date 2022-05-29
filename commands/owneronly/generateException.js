const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'getException',
    aliases: ['generateException','error','erro','gerarErro','gerarException'],
    description: 'Gerar Erro',
    category: 'ownerOnly',
    execute: async (message, _args, client) => {
        const botOwner = client.botOwner

        const permissionErrorEmbed = await client.defaultEmbed.getPermissionError(
            '**Comando somente para o dono do Bot!*',
            '`OWNER_ONLY`'
        )

        permissionErrorEmbed.setColor(client.colors['default'])
        permissionErrorEmbed.setFooter(client.getFooter(message.guild))

        if (message.author.id !== botOwner.id) return message.channel.send({ embeds: [permissionErrorEmbed] })

        const resetEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle('Gerando Exception...')
        await message.channel.send({ embeds: [resetEmbed] })

        client.logger.warn('[DEBUG] ::', 'Erro solicitado pelo Dono\n', true)
        message.channel.send('')
    }
}
