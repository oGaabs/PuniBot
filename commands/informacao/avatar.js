const { MessageEmbed } = require('discord.js')
const moment = require('moment')
moment.locale('pt-br')

module.exports = {
    name: 'avatar',
    aliases: ['profile', 'perfil', 'member',
        'user', 'userinfo', 'info', 'a'],
    description: 'Informações de um usuario!',
    category: 'informação',
    args: '(@usuario)',
    execute: async (message, _args, client) => {
        let userTarget = message.mentions.users.first()
        if (!userTarget || userTarget.length < 1) {
            return message.reply('Mencione o usuario corretamente\n' +
                `Exemplo: ${client.prefix} avatar <@407734609967841299>`)
        }
        const { nickname: userAlias, tag: userTag, id: userId,
                username: userName, presence: userPresence } = userTarget

        userTarget = await message.guild.members.cache.get(userId)
        const UserRoles = userTarget.roles.cache.map(r => r).slice(0, -1).join('\n')

        const userStatus = userPresence ? userPresence.status : 'Não encontrado'
        const userGame = userPresence && userPresence.game ? userPresence.game.name : 'Não encontrado'

        const userAvatarUrl = userTarget.displayAvatarURL({ dynamic: true, size: 1024 })
        const userEmbed = new MessageEmbed()
            .setAuthor({ name: userName, url: userAvatarUrl, iconURL: userAvatarUrl })
            .setColor(client.colors['black'])
            .setThumbnail(userAvatarUrl)
            .addFields(
                { name: 'Discord Tag', value: `\`\`\`md\n${userTag}\`\`\``, inline: true },
                { name: 'Status', value: `\`\`\`md\n# ${userStatus} \`\`\``, inline: true },
                { name: 'Jogando', value: `\`\`\`md\n# ${userGame}\`\`\``, inline: false },
                { name: 'Discord Name', value: `\`\`\`diff\n- ${userName} -\`\`\``, inline: true },
                { name: 'Apelido no servidor', value: `\`\`${userAlias ?? 'Nenhum apelido.'}\`\``, inline: true },
                { name: 'ID', value: `\`\`${userId}\`\``, inline: true },
                { name: 'Conta criada em', value: `\`${moment(userTarget.createdTimestamp).format('LL')}\``, inline: true },
                { name: 'Dias no Discord:', value: `Estou á \`${moment().diff(userTarget.createdAt, 'days')}\` dia (s) no discord`, inline: true },
                { name: 'Dias no servidor:', value: `Estou á \`${moment().diff(userTarget.joinedAt, 'days')}\` dia (s) no servidor`, inline: true },
                { name: 'Meus Cargos', value: UserRoles, inline: true },
                { name: '🌎 | Servidores compartilhados:', value: `${client.guilds.cache.filter(guild => guild.members.cache.get(userId)).map(a => a).join(', ')}\n`, inline: false }
            )

        message.channel.send({ embeds: [userEmbed] })
    }
}
