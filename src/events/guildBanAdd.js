const { EmbedBuilder } = require('discord.js')

module.exports = async function guildBanAdd(client, message) {
    const logsChannel = client.channels.cache.get('926542213012389959')
    const guild = client.guilds.cache.get('926539282733203546')

    client.on('guildBanAdd', async ban => {
        if (ban.guild.id !== guild.id) return
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD'
        })

        const banLog = fetchedLogs.entries.first()
        if (!banLog) return logsChannel.send(`<a:a_Wumpus_Sad:924250380953583659> ${ban.user.tag} foi banido do ${ban.guild.name}, mas nenhum registro de auditoria foi encontrado.`)

        const { executor, target } = banLog
        const banned = new EmbedBuilder()
            .setTitle('Ação | Ban')
            .setColor(client.colors['log'])
            .setDescription(`**Banido!** \n \n
                                 **Staff:**  ${executor.tag} \n
                                 **ID:**  ${executor.id}` + `\n
                                 **Banido:** ${target.tag} \n
                                 **ID:** ${target.id}`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setImage('https://media.discordapp.net/attachments/806749828943970315/905317119321858078/df54d411305571ca5d82371db65a97ea.gif')
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()
        logsChannel.send({ embeds: [banned] })
    }
    )
}
