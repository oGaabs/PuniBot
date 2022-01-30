const { MessageEmbed } = require('discord.js')

module.exports ={
    name: 'ping',
    description: "pong!",
    async execute(message, _args, client) {
        const pingingEmbed = new MessageEmbed()
            .setColor('#9B59B6')
            .setTitle(`**Calculando...**`)
            .setFooter(client.footer)
        await message.reply({embeds : [pingingEmbed]}).then(m => {
            const latencyEmbed = new MessageEmbed()
                .setTitle('**🏓 PONG! 🏓**')
                .setColor('#9B59B6')
                .addFields(
                    { name: 'Bot Latency:', value: `${(m.createdTimestamp - message.createdTimestamp)} ms` },
                    { name: 'API Latency:', value: `${Math.round(client.ws.ping)} ms`, inline: true },
                )
            m.edit({embeds : [latencyEmbed]})
        })
    }
}
