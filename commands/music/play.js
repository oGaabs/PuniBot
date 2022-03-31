const youtube = require('ytdl-core')
const youtubeSearch = require('ytsr')
const youtubePlaylist = require('ytpl')
const { createAudioPlayer, createAudioResource,
        getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice')


const queue = new Map() // {message.guild.id, queue_constructor}, Recebe um object com o id da guild e o queue
module.exports = {
    name: 'play',
    alises: ['tocar'],
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

        const soundArray = await getVideosFromLink(args[0])
        if (!soundArray) return message.reply('Video não foi encontrado, certifique-se que é um link do Youtube valido!')

        if (serverQueue && messageGuild.me.voice.channel) return addSoundToQueue(soundArray, serverQueue)

        const player = createAudioPlayer()
        const queueConstructor = {
            textChannel: message.channel,
            voiceChannel,
            connection: null,
            songs: [],
            player,
            playing: true
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
        let queueSongs = queueConstructor.songs
        const { stream, title } = queueSongs[0]

        playSong(connection, stream, title)

        player.on('idle', () => {
            nextSong(connection)
        })
        player.on('stop', () => {
            stopSong()
        })
        player.on('error', err => {
            console.log(err)
        })
        client.on('voiceStateUpdate', (oldState, newState) => {
            if (!oldState.channelId || newState.channelId || connection.state.status === 'disconnected') return
            connection.destroy()
        })

        async function playSong(connection, stream, title) {
            const resource = createAudioResource(stream)
            await connection.subscribe(player)
            player.play(resource)
            message.channel.send(`Tocando **${title}** neste momento!`)
        }

        async function nextSong(connection) {
            queueSongs.shift()
            if (!queueSongs.length) {
                message.channel.send('Acabaram as músicas. Desconectando...')
                getVoiceConnection(messageGuild.id).disconnect()
                return connection.destroy()
            }
            const { stream, title } = queueSongs[0]
            playSong(connection, stream, title)
        }

        async function stopSong() {
            queueSongs = []
            getVoiceConnection(messageGuild.id).disconnect()
        }

        async function getVideosFromLink(sourceVideo) {
            let soundArray = [{}]
            const playlistRegex = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/

            if (sourceVideo.match(playlistRegex)) {
                let playlist = await youtubePlaylist(sourceVideo, { limit: 100 }).then(res => res.items)

                for (let song of playlist) {
                    try {
                        song = getInfoFromLink(song.url, true)
                        soundArray.push(song)
                    }
                    catch (err) { continue }
                }

                const tempMessage = await message.channel.send('Adicionando a playlist... aguarde!')

                soundArray = await Promise.all(soundArray)
                tempMessage.delete()
                message.channel.send('Playlist adicionada com sucesso!')
                return soundArray
            }

            if (youtube.validateURL(sourceVideo)) {
                const song = await getInfoFromLink(sourceVideo)
                soundArray.push(song)
                return soundArray
            }

            const searchTitle = await youtubeSearch(sourceVideo, { limit: 5 })
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
            const shortUrl = 'youtu.be/'+ songInfo.videoId

            const youtubeOptions = { filter: 'audioonly', type: 'opus', quality: 'highestaudio' }
            const song = {
                stream: youtube(videoLink, youtubeOptions),
                title: songInfo.title, url: shortUrl
            }
            if (!isPlaylist) message.channel.send(`**${song.title}** adicionado a playlist!`)
            return song
        }
    }
}
