const { MessageEmbed } = require('discord.js')
const { Player } = require('discord-player')
let player

module.exports = {
    name: 'splay',
    aliases: ['tocar'],
    description: 'Tocar uma música',
    args: 'Link do video',
    execute: async (message, args, client) => {
        const { channel: voiceChannel } = message.member.voice
        if (!voiceChannel) return message.reply('Você precisa entrar em um canal de texto')

        const channelPermissions = voiceChannel.permissionsFor(message.client.user)
        if (!channelPermissions.has('CONNECT')) return message.reply('Estou sem permissão para conectar ao canal. (CONNECT)')
        if (!channelPermissions.has('SPEAK')) return message.reply('Estou sem permissão para falar no canal. (SPEAK)')

        if (!args[0]) return message.reply('Você precisa disponibilizar um link do youtube. Ex: !p play https://www.youtube.com/watch?v=dQw4w9WgXcQ')

        // Cria uma novo player, caso não exista
        if (!client.player) {
            player = new Player(client, {
                leaveOnEnd: true,
                leaveOnStop: true,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 1000,
                autoSelfDeaf: true,
                initialVolume: 50
            })
            client.player = player

            player.on('queueEnd', queue => {
                onPlaylistEnd(queue)
            })
            player.on('trackStart', (_queue, track) => {
                onNewTrack(message.channel, track)
            })
            player.on('error', _err => {
                client.player= null
            })
            player.on('connectionError', _err => {
                client.player= null
            })
        }

        const messageGuild = message.guild
        const song = args.join(' ')

        const searchResult = await client.player.search(song, {
            requestedBy: message.author
        }).then(s => s).catch(() => { })

        if (!searchResult || !searchResult.tracks.length)
            return message.reply('Video não foi encontrado, certifique-se que é um link do Youtube/Spotify valido\nCaso o erro persista, a API que utilizamos pode estar fora do ar!')

        const guildQueue = client.player.getQueue(messageGuild)
        let queue

        if (!guildQueue) {
            queue = await player.createQueue(messageGuild, {
                metadata: {
                    channel: voiceChannel
                }
            })
        }
        else {
            queue = guildQueue
        }

        playSong(searchResult, queue, voiceChannel)

        async function playSong(searchResult, queue, voiceChannel) {
            // Verifica se uma conexão já foi estabelecida
            try
            {
                if (!queue.connection)
                    await queue.connect(voiceChannel)
            }
            catch {
                queue.destroy()
                return message.reply('Não foi possível entrar no canal de voz!')
            }

            const playEmbed = new MessageEmbed()
                .setColor(client.colors['default'])

            // Adiciona a playlist ou som, e inicia a reprodução
            if (searchResult.playlist){
                const playlist = searchResult.tracks
                queue.addTracks(playlist)

                playEmbed.setTitle('Adicionando a playlist... aguarde!')
                playEmbed.setDescription(`${playlist.length} músicas serão adicionadas a playlist.`)
                const playMessage = await message.channel.send({ embeds: [playEmbed] })

                playEmbed.setTitle('🎵 | Playlist adicionada com sucesso!')
                playEmbed.description = null

                playMessage.edit({ embeds: [playEmbed] })
            }
            else {
                const track = searchResult.tracks[0]
                queue.addTrack(track)

                playEmbed.setTitle(`🎵 | **${track.title}** adicionado a playlist!`)

                message.channel.send({ embeds: [playEmbed] })
            }

            if (!queue.playing) await queue.play()
        }

        async function onNewTrack(textChannel, currentlySong) {
            const shortUrl = currentlySong.url.replace('https://www.youtube.com/watch?v=', 'https://youtu.be/')
            const songEmbed = new MessageEmbed()
                .setColor(client.colors['default'])
                .setTitle('Now playing')
                .setThumbnail(currentlySong.thumbnail)
                .setDescription(`**[${currentlySong.title}](${currentlySong.url})**`)
                .addFields(
                    {
                        name: '**Requisitada pelo(a)**',
                        value: currentlySong.requestedBy.toString() || 'Não informado',
                        inline: true
                    },
                    {
                        name: 'Link',
                        value: `**[${shortUrl}](${shortUrl})**`,
                        inline: true
                    }
                )
            textChannel.send({ embeds: [songEmbed] })
        }

        function onPlaylistEnd(queue) {
            const endEmbed = new MessageEmbed()
                .setColor(client.colors['default'])
                .setTitle('🎵 | Acabaram as músicas. Desconectando...')
            message.channel.send({ embeds: [endEmbed] })
            queue.destroy()
        }
    }
}
