const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'randomSong',
    aliases: ['aleatorizarplaylist', 'aleatorizarmusicas', 'randomsong', 'randomsongs'],
    description: 'Aleatorizar playlist',
    execute: async (message, _args, client) => {
        const { queue } = message.client
        if (!queue) return message.reply('Não ha nenhuma musica sendo tocada!')

        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.reply('Não ha nenhuma musica sendo tocada!')

        serverQueue.songs = aleatorizarPlaylist(serverQueue.songs.slice(1, 11))

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

function aleatorizarPlaylist(playlist) {
    const currentlySong = playlist.shift()
    let lastIndex = playlist.length-1

    while (lastIndex >= 0){
        const randomIndex = Math.floor(Math.random() * lastIndex)
        let randomPosition = playlist[randomIndex]
        let currentIndex = playlist[lastIndex];
        [ playlist[lastIndex], playlist[randomIndex] ] = [randomPosition, currentIndex]
        lastIndex--
    }
    playlist.unshift(currentlySong)
    return playlist
}
