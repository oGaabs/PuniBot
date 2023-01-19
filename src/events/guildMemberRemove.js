const { EmbedBuilder } = require('discord.js')

module.exports = async function guildMemberRemove(client) {
    client.on('guildMemberRemove', async member => {
        if (member.user.bot) return
        const memberName = member.displayName
        let memberImg = member.user.displayAvatarURL()
        if (!memberImg || member.user.avatar === null)
            memberImg = 'https://cdn.discordapp.com/embed/avatars/0.png?size=256'
        const goodbyeEmbed = new EmbedBuilder()
            .setTitle('🔴 | Parece o fim da viagem')
            .setColor(client.colors['log'])
            .addFields([
                { name: 'Até  @' + memberName[0].toUpperCase() + memberName.substring(1), value: ' **Foi uma longa jornada, mas tudo tem um fim.**' },
            ])
            .setThumbnail(memberImg)
            .setDescription('Esperamos que nossos caminhos se alinhem novamente!')
            .setFooter(client.getFooter(member.guild))
            .setTimestamp()

        const canais = client.channels.cache
        const welcomeChannel = canais.get('926540915819028521')
        welcomeChannel.send({ embeds: [goodbyeEmbed] })
    })
}
