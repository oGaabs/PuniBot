const { MessageEmbed } = require('discord.js')

module.exports ={
    name: 'invite',
    description: "Generate invite",
    execute: async (message, _args, client) => {
        const inviteChannel = client.canais.get('926540915819028521')
        const invite = await inviteChannel.createInvite({unique: true, reason: 'Requisitado pelo' + message.author})
        const inviteEmbed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setTitle(" **Puni Invite** ")
            .setColor('#9B59B6')
            .setDescription(`Quer me convidar para seu servidor? Entre por aqui ${invite}`)
            .setFooter(client.footer)
            .setTimestamp()
        message.reply({ embeds: [inviteEmbed]})
    }
}