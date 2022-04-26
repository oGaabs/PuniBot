const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'invite',
    aliases: ['convite', 'compartilhar', 'i'],
    description: 'Gera um convite!',
    execute: async (message, _args, client) => {
        const user = message.member
        const permissionErrorEmbed = new MessageEmbed()
            .setTitle('**Erro:**', true)
            .setColor(client.colors['default'])
            .addField('*Verifique se você possui a permissão:*', '`CREATE_INSTANT_INVITE`', true)
            .setDescription('Missing Permissions')
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()
        if (!user.permissions.has('CREATE_INSTANT_INVITE'))
            return message.channel.send({ embeds: [permissionErrorEmbed] })

        const guild = user.guild
        if (!guild.available) return
        const channels = guild.channels.cache
        const inviteChannel = message.mentions.channels.first() ?? (channels.filter(channel => channel.isText()).first() || guild.systemChannel)

        if (!channels.find(channel => channel === inviteChannel) ||
            !inviteChannel.permissionsFor(user).has('CREATE_INSTANT_INVITE'))
            return message.channel.send({ embeds: [permissionErrorEmbed] })

        const invite = await inviteChannel.createInvite({ unique: true, reason: 'Requisitado pelo ' + message.author.tag })
        const inviteEmbed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setTitle(' **Puni Invite** ')
            .setColor(client.colors['default'])
            .setDescription(`Quer me convidar para seu servidor? Entre por aqui ${invite}`)
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()
        message.reply({ embeds: [inviteEmbed] })
    }
}
