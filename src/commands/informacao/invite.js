const Command = require('../../utils/base/Command.js')

const { ChannelType, EmbedBuilder, PermissionsBitField: { Flags: PERMISSIONS }, inlineCode } = require('discord.js')

class Invite extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            aliases: ['convite', 'compartilhar', 'i'],
            description: 'Gera um convite!',
            category: 'informação'
        })
    }

    async execute(message, _args, client) {
        const member = message.member

        const permissionErrorEmbed = await client.defaultEmbed.getPermissionError(
            '*Verifique se você ou o bot possui a permissão:*',
            inlineCode(PERMISSIONS.CreateInstantInvite)
        )

        permissionErrorEmbed.setColor(client.colors['default'])
        permissionErrorEmbed.setFooter(client.getFooter(message.guild))

        if (!member.permissions.has(PERMISSIONS.CreateInstantInvite))
            return message.channel.send({ embeds: [permissionErrorEmbed] })

        if (!member.guild.available) return

        const inviteChannel = this.getInviteChannel(message, member.guild)

        const channelExistInGuild = member.guild.channels.cache.find(channel => channel === inviteChannel)
        const canSendInviteToChannel = inviteChannel.permissionsFor(member).has(PERMISSIONS.CreateInstantInvite)

        if (!channelExistInGuild || !canSendInviteToChannel)
            return message.channel.send({ embeds: [permissionErrorEmbed] })

        const invite = await inviteChannel.createInvite({ unique: true, reason: 'Requisitado pelo ' + message.author.tag })

        const inviteEmbed = new EmbedBuilder()
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setTitle(' **Puni Invite** ')
            .setColor(client.colors['default'])
            .setDescription(`Você está convidado para o servidor! Entre por aqui ${invite}`)
            .setAuthor({ name: 'Made by ' + member.user.tag, iconURL: 'https://i.imgur.com/AfFp7pu.png', url: invite.toString() })
            .setTimestamp()

        message.reply({ embeds: [inviteEmbed] })
    }

    getInviteChannel(message, guild) {
        const guildChannels = guild.channels.cache
        return message.mentions.channels.first() ?? (guildChannels.filter(channel => channel.type === ChannelType.GuildText).first() || guild.systemChannel)
    }

}

module.exports = Invite
