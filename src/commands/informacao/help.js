const Command = require('../../utils/base/Command.js')

const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')

const formatString = (string) => `${string.charAt(0).toUpperCase()}${string.slice(1)}`

class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['ajuda', 'comandos', 'comandos',
                'bot', 'h'],
            description: 'Mostra os comandos!',
            category: 'informação'
        })
    }

    getTypeOfHelp(typeOfHelp) {
        if (!typeOfHelp)
            return 'default'

        let isCategory = this.client.categories.map(c => c.toLowerCase()).includes(typeOfHelp)
        if (isCategory)
            return 'category'

        let isCommand = this.client.commands.find(cmd => cmd.name === typeOfHelp || (cmd.aliases && cmd.aliases.includes(typeOfHelp)))
        if (isCommand)
            return 'command'

        return 'error'
    }

    async execute(message, args, client) {
        args = args[0]?.toLowerCase()

        const typeOfHelp = this.getTypeOfHelp(args)

        const helpEmbeds = {
            default: () => { // Mensagem de ajuda padrão
                this.defaultHelpEmbed(client, message)
            },
            category: () => { // Mensagem de ajuda de categoria
                this.categoryHelpEmbed(args, message)
            },
            command: () => { // Mensagem de ajuda de comando
                this.commandHelpEmbed(args, message)
            },
            error: () => { // Não foi possível encontrar o que foi solicitado
                message.reply(`Esse comando não existe. Digite ${client.prefix} help para ver todos os comandos!`)
            }
        }

        helpEmbeds[typeOfHelp]() // Envia a mensagem de ajuda
    }

    sendHelpEmbed(embeds, components, channel, messageToEdit) {
        // Edição de categoria
        if (messageToEdit)
            return messageToEdit.edit({ embeds, components })

        channel.send({ embeds, components })
    }

    getPainelOfCategories() {
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help-menu')
            .setPlaceholder('Veja meus comandos.')
            .addOptions([
                {
                    label: 'Entretenimento',
                    description: 'Comandos relacionados a entretenimento.',
                    emoji: '😎',
                    value: 'entretenimento'
                },
                {
                    label: 'Informação',
                    description: 'Comandos relacionados a informação.',
                    emoji: '📓',
                    value: 'informação'
                },
                {
                    label: 'Moderação',
                    description: 'Comandos relacionados a moderação.',
                    emoji: '👨‍✈️',
                    value: 'moderação'
                },
                {
                    label: 'Outros',
                    description: 'Outros comandos.',
                    emoji: '💡',
                    value: 'outros'
                },
                {
                    label: 'Voltar',
                    description: 'Voltar página.',
                    emoji: '🔙',
                    value: 'voltar'
                }
            ])

        const actionPainel = new ActionRowBuilder()
            .addComponents(selectMenu)

        return actionPainel
    }

    defaultHelpEmbed(client, message) {
        const categories = client.categories.map((category) => {
            const commands = this.getCommandsOfCategory(category)
            const categoryName = formatString(category)

            return {
                name: `${categoryName} - ${commands.length} comandos: `,
                value: commands.map(cmd => `\`${cmd.name}\``).join(', ')
            }
        })

        const helpEmbed = new EmbedBuilder()
            .setAuthor({ name: `${client.tag} Bot 🍮`, iconURL: client.user.avatarURL() })
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
            .setColor(client.colors['default'])
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()


        const imageEmbed = new EmbedBuilder()
            .setTitle('☄ | Gabs está aqui!')
            .setThumbnail('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b7521c59-9c6d-4e12-8627-6411b1388bfb/dajq0p5-3bec1efa-7437-4bf5-90b9-0463aa4b8363.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2I3NTIxYzU5LTljNmQtNGUxMi04NjI3LTY0MTFiMTM4OGJmYlwvZGFqcTBwNS0zYmVjMWVmYS03NDM3LTRiZjUtOTBiOS0wNDYzYWE0YjgzNjMuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.sORmjwvRdk0jZ5belg-eayi9BzNmjamQtF5RUZE9tPA')

        message.channel.send({ embeds: [helpEmbed, imageEmbed], components: [this.getPainelOfCategories()] })
    }

    HelpEmbedOfCategories(client, typeOfHelp, message) {
        const categoryName = formatString(typeOfHelp)

        let commands = this.client.commands.filter(cmd => cmd.category.toLowerCase() === typeOfHelp.toLowerCase())

        commands = JSON.parse(JSON.stringify(commands)).map(cmd => {
            let cmdName = this.client.prefix + ' ' + cmd.name
            if (Object.prototype.hasOwnProperty.call(cmd, 'args'))
                cmdName += ' ' + cmd.args

            return {
                name: cmdName,
                value: cmd.description,
                inline: true
            }
        })

        const helpEmbed = new EmbedBuilder()
            .setAuthor({ name: `${client.tag} Bot 🍮`, iconURL: client.user.avatarURL() })
            .setTitle(`:file_folder: | ${categoryName}`)
            .setDescription(`**Digite ${client.prefix} (nome do comando)** para saber mais sobre um comando!`)
            .addFields(commands)
            .setColor(this.client.colors['default'])
            .setFooter(this.client.getFooter(message.guild))
            .setTimestamp()

        message.channel.send({ embeds: [helpEmbed] })
    }

    HelpEmbedOfCommand(client, command, message) {
        let cmdName = formatString(command.name)
        let cmdUsage = client.prefix + ' ' + command.name
        if (Object.prototype.hasOwnProperty.call(command, 'args'))
            cmdUsage += ' ' + command.args

        const helpEmbed = new EmbedBuilder()
            .setAuthor({ name: `${client.tag} Bot 🍮`, iconURL: client.user.avatarURL() })
            .setTitle(`:space_invader: | ${cmdName}`)
            .setDescription(`Descrição: ${command.description}\n` +
                `Apelidos: \`${command.aliases.join('` `')}\``)
            .addFields(
                {
                    name: 'Exemplo de como usar:',
                    value: cmdUsage,
                    inline: true
                }
            )
            .setColor(client.colors['default'])
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()

        message.channel.send({ embeds: [helpEmbed] })
    }
}

module.exports = Help
