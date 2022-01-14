const { MessageEmbed } = require('discord.js')

module.exports = async function guildMemberRemove(client) {
    const canais = client.canais
    const welcomeChannel = canais.get('926540915819028521');

    client.on('guildMemberRemove', async member => {
        if (member.user.bot) return
        const memberName = member.displayName
        let memberImg = member.user.displayAvatarURL()
        if (!memberImg || member.user.avatar === null)
            memberImg ='https://cdn.discordapp.com/embed/avatars/0.png?size=256'
        const goodbyeEmbed = new MessageEmbed()
            .setTitle("🔴 | Parece o fim da viagem")
            .setColor('#992D22')
            .addField('Até  @' + memberName[0].toUpperCase()+ memberName.substring(1), ' **Foi uma longa jornada, mas tudo tem um fim.**')
            .setThumbnail(memberImg)
            .setDescription('Esperamos que nossos caminhos se alinhem novamente!')
            .setTimestamp()
            .setFooter(client.footer)
        welcomeChannel.send({ embeds: [goodbyeEmbed]})
    })
}