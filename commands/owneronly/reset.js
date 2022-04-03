const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'reset',
    aliases: ['restart','resetar','reiniciar'],
    description: 'Reiniciar Bot',
    execute: async (message, _args, client) => {
        const botOwner = client.botOwner
        const permissionErrorEmbed = new MessageEmbed()
            .setTitle('**Erro:**', true)
            .setColor(client.getColor('default'))
            .addField('*Comando somente para o dono do Bot!*', '`OWNER_ONLY`', true)
            .setDescription('Missing Permissions')
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()
        if (message.author.id !== botOwner.id) return message.channel.send({ embeds: [permissionErrorEmbed] })

        const resetEmbed = new MessageEmbed()
            .setColor(client.getColor('default'))
            .setTitle('Resetando...')
        await message.channel.send({ embeds: [resetEmbed] })

        console.log('Restart solicitado pelo Dono\n')
        client.destroy()
        client.login(process.env.TOKEN)
            .then(() => console.log(`\nLogado como ${client.user.tag}.`))
            .catch(err => console.log(`Falha ao reiniciar o bot : ${err}`))
    }
}