const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'bassboost',
    aliases: ['batidao', 'bass'],
    description: 'Aleatorizar playlist',
    execute: async (message, _args, client) => {
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.reply('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.reply('Você precisa entrar no mesmo canal de voz!')

        await queue.setFilters({
            bassboost: !queue.getFiltersEnabled().includes('bassboost'),
            normalizer2: !queue.getFiltersEnabled().includes('bassboost') // because we need to toggle it with bass
        })

        const autoplayEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle(`🎵 | Bassboost: ${queue.getFiltersEnabled().includes('bassboost') ? 'ON' : 'OFF'}`)

        setTimeout(() => {
            return message.channel.send({ embeds: [autoplayEmbed] })
        }, queue.options.bufferingTimeout)
    }
}