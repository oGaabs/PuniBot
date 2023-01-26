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

    async execute(userMessage, _args, client) {
        const pingingEmbed = new EmbedBuilder()
            .setTitle('**Calculando...**')
            .setColor(client.colors['default'])
            .setFooter(client.getFooter(userMessage.guild))

        const botMessage = await userMessage.channel.send({ embeds: [pingingEmbed] })
        const delayEntreMensagens = botMessage.createdTimestamp - userMessage.createdTimestamp

        const latencyEmbed = new EmbedBuilder()
            .setTitle('**🏓 PONG! 🏓**')
            .addFields(
                { name: 'Bot Latency:', value: `${(delayEntreMensagens)} ms` },
                { name: 'API Latency:', value: `${Math.round(client.ws.ping)} ms`, inline: true },
            )
            .setColor(client.colors['default'])

        botMessage.edit({ embeds: [latencyEmbed] })
    }
}

module.exports = Ping

