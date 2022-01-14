const { MessageEmbed } = require('discord.js')

module.exports ={
    name: 'help',
    description: "Show commands!",
    async execute(message, _args, client) {
        const commands = client.commands
        let commandsSize = 0
        commands.forEach(cmd => {
            cmd.name  = '!p ' + cmd.name
            cmd.value = cmd.description
            cmd.inline = true;
            if(cmd.hasOwnProperty('args')){
                cmd.name = cmd.name + ' ' + cmd.args
                delete cmd.args
            }
            delete cmd.description
            delete cmd.execute
            commandsSize++
        })
        const helpEmbed = new MessageEmbed()
            .setTitle('🟪 | A AJUDA CHEGOU')
            .setColor('#9B59B6')
            .setDescription('Sou um simples bot de moderação que fabrica Pudims!')
            .setTimestamp()
            .setFooter(client.footer)
            .addFields(
                commands.map((nome) => {
                    return nome
                }),
                {
                    name: `${client.user.tag} Bot 🍮`,
                    value: `Atualmente temos ${client.guild.memberCount} membros e ${commandsSize} comandos em nosso bot!`
                },
                {
                    name: 'Convide mais pessoas ao servidor!',
                    value: `[Invite Link](https://discord.com/invite/TRTutqsF)`
                }
            )
        const pudimEmbed = new MessageEmbed()
            .setTitle('🍮| PUDIM')
            .setThumbnail('https://revistamenu.com.br/wp-content/uploads/2020/05/diadopudim-1280x720.jpg')
            .setTimestamp()
            .setFooter(client.footer)
        message.channel.send({embeds: [helpEmbed,pudimEmbed]})
    }
}
