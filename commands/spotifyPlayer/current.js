const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'scurrent',
    aliases: ['atual', 'playing', 'song', 'music', 'tocando', 'link', 'nowplaying'],
    description: 'Música atual',
    execute: async (message, _args, client) => {
        const voiceChannel = message.member.voice.channel
        const queue = client.player?.getQueue(message.guild)

        if (!queue || !queue.playing) return message.reply('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.reply('Você precisa entrar no mesmo canal de voz!')

        const currentlyTrack = queue.current
        const songUrl = currentlyTrack.url.replace('https://www.youtube.com/watch?v=', 'https://youtu.be/')

        const songEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle('Now playing')
            .setDescription(`**[${currentlyTrack.title}](${songUrl})**`)
            .addFields(
                {
                    name: '**Requisitada pelo(a)**',
                    value: currentlyTrack.requestedBy.toString() || 'Não informado',
                    inline: true
                },
                {
                    name: 'Link',
                    value: `**[${songUrl}](${songUrl})**`,
                    inline: true
                }
            )


        const row = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setEmoji('📀')
                    .setLabel('LINK')
                    .setStyle('LINK')
                    .setURL(songUrl),
            ])

        message.channel.send({ ephemeral: true, embeds: [songEmbed], components: [row] })
    }
}
