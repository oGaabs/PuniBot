const Command = require('../../../utils/base/Command.js')

const { MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js')

class AutoRoleCreate extends Command {
    constructor(client) {
        super(client, {
            name: 'autoRoleCreate',
            aliases: ['arcreate','autorole','arc'],
            description: 'Da cargos ao clicar no botão de seleção.',
            category: 'outros'
        })
    }

    async execute (message, args, client){
        const permissionErrorEmbed = await client.defaultEmbed.getPermissionError(
            '*Verifique se você ou o bot possui a permissão:*',
            '`OWNER`'
        )

        permissionErrorEmbed.setColor(client.colors['default'])
        permissionErrorEmbed.setFooter(client.getFooter(message.guild))

        if (message.author.id !== message.guild.ownerId)
            return message.channel.send({ embeds: [permissionErrorEmbed] })

        const title = args.filter(arg => {
            return !(arg.startsWith('<@&') || arg.startsWith('<@') || arg.startsWith('<#'))
        })
        if (!title || title.length == 0) return message.reply('*Você deve informar o título dos cargos.*')

        const roles = message.mentions.roles
        if (roles.length <= 0) return

        const rolesInfo = roles.map(role => {
            return {
                label: role.name,
                value: role.id
            }
        })

        const titleEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle(title.join(' ')) //Exemplo: 🎮 | Jogos jogados:

        const painel = new MessageActionRow()
            .addComponents([
                new MessageSelectMenu()
                    .setCustomId('autorole-menu')
                    .setMinValues(0)
                    .setMaxValues(rolesInfo.length)
                    .setPlaceholder('Nenhum selecionado.')
                    .addOptions(rolesInfo)
            ])

        message.channel.send({ embeds: [titleEmbed],  components: [painel], ephemeral: true}).then(() => {
            setTimeout(() => message.delete(), 1000)
        })
    }
}

module.exports = AutoRoleCreate
