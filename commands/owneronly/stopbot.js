const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'stopbot',
    aliases: ['pararbot','desligar'],
    description: 'Desliga o Bot',
    execute: async (message, _args, client) => {
        const botOwner = client.botOwner
        const permissionErrorEmbed = new MessageEmbed()
            .setTitle('**Erro:**', true)
            .setColor(client.getColor('default'))
            .addField('*Comando somente para o dono do Bot!*', '`OWNER_ONLY`', true)
            .setDescription('Missing Permissions')
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()
        if (message.author.id !== botOwner.id) return message.channel.send({ embeds: [permissionErrorEmbed] })

        const stopEmbed = new MessageEmbed()
            .setColor(client.getColor('default'))
            .setTitle('Desligando...')
        await message.channel.send({ embeds: [stopEmbed] })

        console.log('Desligamento solicitado pelo Dono\n')
        client.destroy()
        process.exit()
    }
}