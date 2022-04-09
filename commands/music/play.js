
const youtube = require('ytdl-core')
const youtubeSearch = require('ytsr')
const youtubePlaylist = require('ytpl')
const { MessageEmbed } = require('discord.js')
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice')


const queue = new Map() // {message.guild.id, queue_constructor}, Recebe um object com o id da guild e o queue
module.exports = {
    name: 'play',
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

        const messageGuild = message.guild
        const serverQueue = queue.get(messageGuild.id)
        client.queue = queue

        const soundArray = await getVideosFromLink(args.join(' '))
        if (soundArray === null) return message.reply('Video não foi encontrado, certifique-se que é um link do Youtube valido!')

        if (serverQueue && messageGuild.me.voice.channel) return addSoundToQueue(soundArray, serverQueue)

        const player = createAudioPlayer()
        let queueConstructor = {
            textChannel: message.channel,
            voiceChannel,
            connection: null,
            songs: [],
            player,
            autoPlay: false
        }

        queue.set(messageGuild.id, queueConstructor)
        addSoundToQueue(soundArray, queueConstructor)

        let connection
        try {
            connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: messageGuild.id,
                adapterCreator: messageGuild.voiceAdapterCreator
            })
            queueConstructor.connection = connection
        }
        catch (error) {
            queue.delete(messageGuild.id)
            return message.reply('Não foi possível entrar no canal de voz!')
        }

        playSong(connection, queueConstructor.songs[0])

        player.on('idle', () => {
            nextSong(connection)
        })
        player.on('stop', () => {
            stopSong()
        })
        player.on('error', err => {
            stopSong()
            console.log(err)
        })
        client.on('voiceStateUpdate', (oldState, newState) => {
            if (!oldState.channelId || newState.channelId || connection.state.status === 'disconnected' || connection.state.status === 'destroyed')
                return
            try {
                stopSong()
            }
            catch (err) {console.log(err)}
        })

        async function playSong(connection, { stream, title, url, thumbnail, requestBy}) {
            const youtubeOptions = { filter: 'audioonly', type: 'opus', quality: 'highestaudio' , highWaterMark: 1 << 25}
            const audio = youtube(stream, youtubeOptions)

            const resource = createAudioResource(audio, {highWaterMark: 1})
            await connection.subscribe(player, {highWaterMark: 1})
            player.play(resource)

            const songEmbed = new MessageEmbed()
                .setColor(client.colors['default'])
                .setTitle('Now playing')
                .setThumbnail(thumbnail)
                .setDescription(`**[${title}](${url})**`)
                .addFields(
                    {
                        name: '**Requisitada pelo(a)**',
                        value: requestBy,
                        inline: true
                    },
                    {
                        name: 'Link',
                        value: `**[${url}](${url})**`,
                        inline: true
                    }
                )
            message.channel.send({ embeds: [songEmbed] })
        }

        async function nextSong(connection) {
            const currentlySong = queueConstructor.songs.shift()
            if (queueConstructor.autoPlay)
                queueConstructor.songs.push(currentlySong)
            if (!queueConstructor.songs.length) {
                const endEmbed = new MessageEmbed()
                    .setColor(client.colors['default'])
                    .setTitle('🎵 | Acabaram as músicas. Desconectando...')
                message.channel.send({ embeds: [endEmbed] })
                // return getVoiceConnection(messageGuild.id).disconnect()
                return connection.destroy()
            }

            playSong(connection, queueConstructor.songs[0])
        }

        async function stopSong() {
            connection.destroy()
            queueConstructor = {}
        }

        async function getVideosFromLink(sourceVideo) {
            let soundArray = [{}]
            const playlistRegex = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/

            const playEmbed = new MessageEmbed()
                .setColor(client.colors['default'])


            if (sourceVideo.match(playlistRegex)) {
                let playlist = await youtubePlaylist(sourceVideo, { limit: 100 }).then(res => res.items)

                for (let song of playlist) {
                    try {
                        song = getInfoFromLink(song.url, true)
                        soundArray.push(song)
                    }
                    catch (err) { continue }
                }

                playEmbed.setTitle('Adicionando a playlist... aguarde!')
                const playMessage = await message.channel.send({ embeds: [playEmbed] })

                soundArray = await Promise.all(soundArray)
                playEmbed.setTitle('🎵 | Playlist adicionada com sucesso!')
                playMessage.edit({ embeds: [playEmbed] })
                return soundArray
            }

            if (youtube.validateURL(sourceVideo)) {
                const song = await getInfoFromLink(sourceVideo)
                soundArray.push(song)
                return soundArray
            }
            const filterVideos = await youtubeSearch.getFilters(sourceVideo).then(
                res => res.get('Type').get('Video')
            )
            const searchTitle = await youtubeSearch(filterVideos.url, { limit: 5 })
            if (searchTitle) {
                const song = await getInfoFromLink(searchTitle.items[0].url)
                soundArray.push(song)
                return soundArray
            }
            return null
        }

        function addSoundToQueue(soundArray, queueToAdd) {
            for (const sound of soundArray) {
                if (Object.keys(sound).length === 0) continue
                queueToAdd.songs.push(sound)
            }
        }

        async function getInfoFromLink(videoLink, isPlaylist) {
            const songInfo = await youtube.getBasicInfo(videoLink).then(info => info.videoDetails)
            const shortUrl = 'https://youtu.be/'+ songInfo.videoId
            const thumbnail = songInfo.thumbnails.pop()

            const song = {
                stream: videoLink,
                title: songInfo.title, url: shortUrl,
                thumbnail: thumbnail.url, requestBy: message.author.toString()
            }

            if (!isPlaylist){
                const playEmbed = new MessageEmbed()
                    .setColor(client.colors['default'])
                    .setTitle(`🎵 | **${song.title}** adicionado a playlist!`)
                message.channel.send({ embeds: [playEmbed] })
            }
            return song
        }
    }
}
