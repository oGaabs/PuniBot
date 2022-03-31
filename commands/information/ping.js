const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'ping',
    aliases: ['latencia', 'latency', 'lag',
        'velocidade', 'api', 'p'],
    description: 'pong!',
    execute: async (message, _args, client) => {
        const pingingEmbed = new MessageEmbed()
            .setTitle('**Calculando...**')
            .setColor(client.getColor('default'))
            .setFooter(client.getFooter(message))
        await message.channel.send({ embeds: [pingingEmbed] }).then(m => {
            const latencyEmbed = new MessageEmbed()
                .setTitle('**🏓 PONG! 🏓**')
                .setColor(client.getColor('default'))
                .addFields(
                    { name: 'Bot Latency:', value: `${(m.createdTimestamp - message.createdTimestamp)} ms` },
                    { name: 'API Latency:', value: `${Math.round(client.ws.ping)} ms`, inline: true },
                )
            m.edit({ embeds: [latencyEmbed] })
        })
    }
}
