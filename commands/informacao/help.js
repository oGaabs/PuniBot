const { MessageEmbed } = require('discord.js')

const formatString = (string) => `${string.charAt(0).toUpperCase()}${string.slice(1)}`

module.exports = {
    name: 'help',
    aliases: ['ajuda', 'comandos', 'comandos',
        'bot', 'h'],
    description: 'Mostra os comandos!',
    category: 'informação',
    execute: async (message, args, client) => {

        const helpEmbed = new MessageEmbed()
            .setAuthor({ name: `${client.tag} Bot 🍮`, iconURL: client.user.avatarURL() })
            .setColor(client.colors['default'])
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()


        const pudimEmbed = new MessageEmbed()
            .setTitle('🍮| PUDIM')
            .setThumbnail('https://revistamenu.com.br/wp-content/uploads/2020/05/diadopudim-1280x720.jpg')
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()


        if (!args[0]) {
            let categories = [...new Set(client.categories)]

            categories = categories.map((category) => {
                const commands = getCommandsOfCategory(category)
                const categoryName = formatString(category)

                return {
                    name: `${categoryName} - ${commands.length} comandos: `,
                    value: commands.map(cmd => `\`${cmd.name}\``).join(', ')
                }
            })

            helpEmbed
                .setTitle('🟣 | A Ajuda Chegou!')
                .setDescription('Sou um simples bot de moderação que fabrica Pudims!\n' +
                    `:file_folder: | **Digite ${client.prefix} (categoria)** para exibir todos os comandos de uma categoria ou \n` +
                    `:space_invader: | **Digite ${client.prefix} (nome do comando)** para saber mais sobre um comando!**`)
                .addFields(
                    categories,
                    {
                        name: 'Convide mais pessoas ao servidor!',
                        value: `Atualmente temos ${message.guild.memberCount} membros e ${client.commands.size} comandos em nosso bot!\n` +
                            '[Invite Link](https://discord.gg/4YCgPhSnmM)'
                    }
                )

            return message.channel.send({ embeds: [helpEmbed, pudimEmbed] })
        }


        const typeOfHelp = args[0].toLowerCase()

        let isCategory = client.categories.map(c => c.toLowerCase()).includes(typeOfHelp)

        if (isCategory) {
            const categoryName = formatString(typeOfHelp)

            let commands = client.commands.filter(cmd => cmd.category.toLowerCase() === typeOfHelp.toLowerCase())

            commands = JSON.parse(JSON.stringify(commands)).map(cmd => {
                let cmdName = client.prefix + ' ' + cmd.name
                if (Object.prototype.hasOwnProperty.call(cmd, 'args'))
                    cmdName += ' ' + cmd.args
                return {
                    name: cmdName,
                    value: cmd.description,
                    inline: true
                }
            })

            helpEmbed
                .setAuthor({ name: `${client.tag} Bot 🍮`, iconURL: client.user.avatarURL() })
                .setTitle(`:file_folder: | ${categoryName}`)
                .setDescription(`**Digite ${client.prefix} (nome do comando)** para saber mais sobre um comando!`)
                .addFields(
                    commands
                )
            return message.channel.send({ embeds: [helpEmbed] })
        }

        const cmd = client.commands.find(cmd => cmd.name === typeOfHelp || (cmd.aliases && cmd.aliases.includes(typeOfHelp)))

        if (cmd != undefined) {
            let cmdName = formatString(cmd.name)
            let cmdUsage = client.prefix + ' ' + cmd.name
            if (Object.prototype.hasOwnProperty.call(cmd, 'args'))
                cmdUsage += ' ' + cmd.args

            helpEmbed
                .setTitle(`:space_invader: | ${cmdName}`)
                .setDescription(`Descrição: ${cmd.description}\n`+
                                `Apelidos: \`${cmd.aliases.join('` `')}\``)
                .addFields(
                    {
                        name: 'Exemplo de como usar:',
                        value: cmdUsage,
                        inline: true
                    }
                )
            return message.channel.send({ embeds: [helpEmbed]})
        }


        function getCommandsOfCategory(category) {
            let commands
            try
            {
                commands = client.commands
                    .filter(cmd => cmd.category.toLowerCase() === category.toLowerCase())
                    .map(cmd => {
                        return {
                            name: cmd.name,
                            description: cmd.description,
                        }
                    })
            }
            catch (error) {
                return null
            }

            return commands
        }

    }
}
