const { EmbedBuilder } = require('discord.js')

module.exports = async function guildMemberAdd(client) {
    client.on('guildMemberAdd', async member => {
        if (member.user.bot) {
            const botRole = member.guild.roles.cache.get('926567305155055717')
            return member.roles.add(botRole)
        }

        const canais = client.channels.cache
        const welcomeChannel = canais.get('926540915819028521')
        const generalChannel = canais.get('926546664783773847')
        if (!welcomeChannel || !generalChannel)
            return

        let memberImg = member.user.displayAvatarURL()
        if (!memberImg || member.user.avatar === null)
            memberImg = 'https://cdn.discordapp.com/embed/avatars/0.png?size=256'

        const welcomeEmbed = new EmbedBuilder()
            .setTitle('🌌 | Olá *Viajante*')
            .setColor(client.colors['default'])
            .addFields([
                { name: '⁣', value: `<@!${member.id}> **Sabemos que a estrada a frente é longa e perigosa, por isso sua presença é imprescindível em nossa jornada!**`, inline: true },
            ])
            .setDescription('Curta essa noite estrelada conosco, encontre seu cantinho e aproveite a viagem!  😉')
            .setThumbnail(memberImg)
            .setFooter(client.getFooter(member.guild))
            .setTimestamp()
        const welcomeEmbedSimple = new EmbedBuilder()
            .setTitle('Bem-vindo à Caravana do Pudim')
            .setColor(client.colors['default'])
            .addFields([
                { name: 'Novo membro', value: [`<@${member.id}>`, 'Sua jornada começa aqui! <:milkyway_ej:930178378579988500>'].join('\n'), inline: false },
            ])
            .setFooter(client.getFooter(member.guild))

        welcomeChannel.send({ embeds: [welcomeEmbed] })
        generalChannel.send({ embeds: [welcomeEmbedSimple] })

        
        const roleSeparator = member.guild.roles.cache.get('926709141014196265')
        const welcomeRole = member.guild.roles.cache.get('930038268173643808')

        member.roles.add([roleSeparator, welcomeRole])
    })
}
