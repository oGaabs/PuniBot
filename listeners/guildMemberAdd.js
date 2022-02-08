const { MessageEmbed } = require('discord.js')

module.exports = async function guildMemberAdd(client) {
    const canais = client.canais
    const welcomeChannel = canais.get('926540915819028521')
    const generalChannel = canais.get('926546664783773847')

    client.on('guildMemberAdd', async member => {
        if (member.user.bot) {
            const botRole = member.guild.roles.cache.get('926567305155055717')
            return member.roles.add(botRole)
        }
        let memberImg = member.user.displayAvatarURL()
        if (!memberImg || member.user.avatar === null)
            memberImg = 'https://cdn.discordapp.com/embed/avatars/0.png?size=256'
        const color = client.getColor('default')
        const footer = client.getFooter(message)
        const welcomeEmbed = new MessageEmbed()
            .setTitle("🌌 | Olá *Viajante*")
            .setColor(color)
            .addField("⁣", `<@!${member.id}> **Sabemos que a estrada a frente é longa e perigosa, por isso sua presença é imprescindível em nossa jornada!**`, true)
            .setDescription('Curta essa noite estrelada conosco, encontre seu cantinho e aproveite a viagem!  😉')
            .setThumbnail(memberImg)
            .setFooter(footer)
            .setTimestamp()
        const welcomeEmbedSimple = new MessageEmbed()
            .setTitle('Bem-vindo à Caravana do Pudim')
            .setColor(color)
            .addField('Novo membro', [`<@${member.id}>`, 'Sua jornada começa aqui! <:milkyway_ej:930178378579988500>'].join('\n'), false)
            .setFooter(footer)
        welcomeChannel.send({ embeds: [welcomeEmbed] })
        generalChannel.send({ embeds: [welcomeEmbedSimple] })

        const separatorRole = member.guild.roles.cache.get('926709141014196265')
        const welcomeRole = member.guild.roles.cache.get('930038268173643808')

        member.roles.add(separatorRole)
        member.roles.add(welcomeRole)
    })
}