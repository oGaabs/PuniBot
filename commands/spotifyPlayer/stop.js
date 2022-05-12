const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'sstop',
    aliases: ['parar','clear','limpar','desconectar','disconnect'],
    description: 'Parar playlist',
    execute: async (message, _args, client) => {
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.reply('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.reply('Você precisa entrar no mesmo canal de voz!')

        queue.destroy()

        const playEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle('🛑 | Playlist parada!')

        message.channel.send({ embeds: [playEmbed] })
    }
}
