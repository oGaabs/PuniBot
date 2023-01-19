const Command = require('../../utils/base/Command.js')

const { EmbedBuilder, codeBlock, inlineCode } = require('discord.js')
const moment = require('moment')
moment.locale('pt-br')

class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            aliases: ['profile', 'perfil', 'member',
                'user', 'userinfo', 'info', 'a'],
            description: 'Informações de um usuario!',
            category: 'informação',
            args: '(@usuario)'
        })
    }

    async execute(message, _args, client) {
        const userTarget = message.mentions.users.first()
        if (!userTarget || userTarget.length < 1)
            return message.reply(`Mencione o usuário corretamente\nExemplo: ${client.prefix} avatar <@407734609967841299>`)

        const { username: userName, tag: userTag, id: userId } = userTarget
        const memberTarget = message.guild.members.cache.get(userId)
        const userPresence = memberTarget.presence
        const userRoles = Array.from(memberTarget.roles.cache.values()).slice(0, -1).join('\n')

        const userStatus = userPresence?.status ?? 'offline'
        const userGame = userPresence?.game?.name ?? 'Não está jogando'

        const userAlias = memberTarget.nickname ?? 'Nenhum apelido.'
        const userAvatarUrl = memberTarget.displayAvatarURL({ dynamic: true, size: 1024 })

        const userEmbed = new EmbedBuilder()
            .setAuthor({ name: userName, url: userAvatarUrl, iconURL: userAvatarUrl })
            .setColor(client.colors['black'])
            .setThumbnail(userAvatarUrl)
            .addFields(
                { name: 'Discord Tag', value: codeBlock('md', userTag), inline: true },
                { name: 'Status', value: codeBlock('md', `# ${userStatus}`), inline: true },
                { name: 'Jogando', value: codeBlock('md', `# ${userGame}`), inline: false },
                { name: 'Discord Name', value: codeBlock('diff', `- ${userName} -`), inline: true },
                { name: 'Apelido no servidor', value: codeBlock(userAlias), inline: true },
                { name: 'ID', value: codeBlock(userId), inline: true },
                { name: 'Conta criada em', value: `${inlineCode(moment(userTarget.createdTimestamp).format('LL'))}`, inline: true },
                { name: 'Dias no Discord:', value: `Estou á ${inlineCode(moment().diff(userTarget.createdAt, 'days'))} dia (s) no discord`, inline: true },
                { name: 'Dias no servidor:', value: `Estou á ${inlineCode(moment().diff(memberTarget.joinedAt, 'days'))} dia (s) no servidor`, inline: true },
                { name: 'Meus Cargos', value: userRoles, inline: true },
                { name: '🌎 | Servidores compartilhados:', value: `${client.guilds.cache.filter(guild => guild.members.cache.get(userId)).map(a => a).join(', ')}\n`, inline: false }
            )

        message.channel.send({ embeds: [userEmbed] })
    }
}

module.exports = Avatar
