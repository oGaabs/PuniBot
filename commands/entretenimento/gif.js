const Command = require('../../utils/base/Command.js')

const { MessageEmbed } = require('discord.js')
const { gifSearch } = require('../../utils')

class GifSearch extends Command {
    constructor(client) {
        super(client, {
            name: 'gif',
            aliases: ['tenor', 'gifsearch','g'],
            description: 'Mande um GIF!',
            category: 'entretenimento',
            args: '(Tema)'
        })
    }

    async execute (message, args, client){
        const searchTerm = args.join(' ') || 'pudim'
        const gif = await gifSearch.getGif(searchTerm)
        if (gif === null)
            return message.reply('Não encontrei nenhum GIF!')

        const gifEmbed = new MessageEmbed()
            .setTitle('Aqui está seu gif!')
            .setImage(gif.image)
            .setURL(gif.url)
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()
        message.reply({ embeds: [gifEmbed] })
    }
}

module.exports = GifSearch

