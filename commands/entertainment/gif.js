const { MessageEmbed } = require('discord.js')
const { gifSearch } = require('../../utils')

module.exports = {
    name: 'gif',
    alises: ['tenor', 'g'],
    description: 'Mande um GIF!',
    args: '(Tema)',
    execute: async (message, args, client) => {
        const searchTerm = args.join(' ') || 'pudim'
        const gif = await gifSearch.getGif(searchTerm)

        const gifEmbed = new MessageEmbed()
            .setTitle('Aqui está seu gif!')
            .setImage(gif.image)
            .setURL(gif.url)
            .setFooter(client.getFooter(message))
            .setTimestamp()
        message.reply({ embeds: [gifEmbed] })
    }
}
