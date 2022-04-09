const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'current',
    aliases: ['atual', 'playing', 'song', 'music', 'tocando', 'link', 'nowplaying'],
    description: 'Música atual',
    execute: async (message, _args, client) => {
        const { queue } = message.client
        if (!queue) return message.reply('Não ha nenhuma musica sendo tocada!')

        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.reply('Não ha nenhuma musica sendo tocada!')

        const currentlySong = serverQueue.songs[0]
        const songUrl = currentlySong.url

        const songEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle('Now playing')
            .setThumbnail(currentlySong.thumbnail)
            .setDescription(`**[${currentlySong.title}](${songUrl})**`)
            .addFields(
                {
                    name: '**Requisitada pelo(a)**',
                    value: currentlySong.requestBy,
                    inline: true
                },
                {
                    name: 'Link',
                    value: `**[${songUrl}](${songUrl})**`,
                    inline: true
                }
            )
        message.channel.send({ embeds: [songEmbed] })
    }
}
