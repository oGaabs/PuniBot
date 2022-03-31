module.exports = {
    name: 'queue',
    alises: ['playlist', 'song', 'songs', 'music', 'musics', 'tocando'],
    description: 'Músicas na playlist',
    execute: async (message, _args, _client) => {
        const { queue } = message.client
        if (!queue) return message.reply('Não ha nenhuma musica sendo tocada!')

        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.reply('Não ha nenhuma musica sendo tocada!')
        const songs = serverQueue.songs
        const currentlySong = songs[0]
        message.reply(`Tocando **${currentlySong.title}**\nLink: ${currentlySong.url}`)

        let playlist = ''
        for (const song of songs) {
            const { title, url } = song
            playlist = playlist.concat((`Música: \`${title}\`\nLink: **${url}**\n`))
        }
        message.channel.send(playlist).then(msg => msg.suppressEmbeds(true))
    }
}