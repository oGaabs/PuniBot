const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'getException',
    aliases: ['generateException','error','erro','gerarErro','gerarException'],
    description: 'Gerar Erro',
    execute: async (message, _args, client) => {
        const botOwner = client.botOwner
        const permissionErrorEmbed = new MessageEmbed()
            .setTitle('**Erro:**', true)
            .setColor(client.colors['default'])
            .addField('*Comando somente para o dono do Bot!*', '`OWNER_ONLY`', true)
            .setDescription('Missing Permissions')
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()
        if (message.author.id !== botOwner.id) return message.channel.send({ embeds: [permissionErrorEmbed] })

        const resetEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle('Gerando Exception...')
        await message.channel.send({ embeds: [resetEmbed] })

        client.logger.warn('[DEBUG] ::', 'Erro solicitado pelo Dono\n')
        message.channel.send('')
    }
}