const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'help',
    aliases: ['ajuda', 'comandos', 'comandos',
        'bot', 'h'],
    description: 'Mostra os comandos!',
    execute: async (message, _args, client) => {
        const commands = JSON.parse(JSON.stringify(client.commands)).map(cmd => {
            let cmdName = client.prefix + ' ' + cmd.name
            if (Object.prototype.hasOwnProperty.call(cmd, 'args'))
                cmdName += ' ' + cmd.args
            return {
                name: cmdName,
                value: cmd.description,
                inline: true
            }
        })

        const helpEmbed = new MessageEmbed()
            .setTitle('🟣 | A AJUDA CHEGOU')
            .setColor(client.getColor('default'))
            .setDescription('Sou um simples bot de moderação que fabrica Pudims!')
            .addFields(
                commands,
                {
                    name: `${client.user.tag} Bot 🍮`,
                    value: `Atualmente temos ${message.guild.memberCount} membros e ${commands.length} comandos em nosso bot!`
                },
                {
                    name: 'Convide mais pessoas ao servidor!',
                    value: '[Invite Link](https://discord.gg/4YCgPhSnmM)'
                }
            )
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()

        const pudimEmbed = new MessageEmbed()
            .setTitle('🍮| PUDIM')
            .setThumbnail('https://revistamenu.com.br/wp-content/uploads/2020/05/diadopudim-1280x720.jpg')
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()
        message.channel.send({ embeds: [helpEmbed, pudimEmbed] })
    }
}
