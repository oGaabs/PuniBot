const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'loop',
    aliases: ['autoplay','semparar', 'dontstop'],
    description: 'Loop na playlist',
    execute: async (message, _args, client) => {
        const { queue } = message.client
        if (!queue) return message.reply('Não ha nenhuma musica sendo tocada!')

        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.reply('Não ha nenhuma musica sendo tocada!')

        const status = !serverQueue.autoPlay
        serverQueue.autoPlay = status

        const autoplayEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle(`🎵 | AutoPlay: ${status ? 'ON' : 'OFF'}`)
        message.channel.send({ embeds: [autoplayEmbed] })
    }
}
