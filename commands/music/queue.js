const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'queue',
    aliases: ['playlist', 'songs', 'lista', 'list', 'musicas', 'musics'],
    description: 'Músicas na playlist',
    execute: async (message, _args, client) => {
        const { queue } = message.client
        if (!queue) return message.reply('Não ha nenhuma musica sendo tocada!')

        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.reply('Não ha nenhuma musica sendo tocada!')
        const songs = serverQueue.songs
        const currentlySong = songs[0]

        let playlist = []
        for (let { title, url }  of songs) {
            url = 'https://' + currentlySong.url
            playlist.push(`**[${title.substring(0, 51)}](${url})**\n`)
        }
        const listEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle('Lista de Reprodução')
            .setThumbnail(currentlySong.thumbnail)
            .setDescription(`Now playing: **[${currentlySong.title.substring(0, 51)}](${currentlySong.url})**\n\n`+
                              playlist.join(' '))
        message.channel.send({ embeds: [listEmbed] })
    }
}
