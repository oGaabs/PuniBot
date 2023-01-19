const Command = require('../../utils/base/Command.js')

const { EmbedBuilder } = require('discord.js')

class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            aliases: ['latencia', 'latency', 'lag',
                'velocidade', 'api', 'p'],
            description: 'pong!',
            category: 'informação'
        })
    }

    async execute(message, _args, client) {
        const pingingEmbed = new EmbedBuilder()
            .setTitle('**Calculando...**')
            .setColor(client.colors['default'])
            .setFooter(client.getFooter(message.guild))
        await message.channel.send({ embeds: [pingingEmbed] }).then(m => {
            const latencyEmbed = new EmbedBuilder()
                .setTitle('**🏓 PONG! 🏓**')
                .setColor(client.colors['default'])
                .addFields(
                    { name: 'Bot Latency:', value: `${(m.createdTimestamp - message.createdTimestamp)} ms` },
                    { name: 'API Latency:', value: `${Math.round(client.ws.ping)} ms`, inline: true },
                )
            m.edit({ embeds: [latencyEmbed] })
        })
    }
}

module.exports = Ping

