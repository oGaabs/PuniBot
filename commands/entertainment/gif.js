const { MessageEmbed } = require('discord.js')
const nodeFetch = require('node-fetch')

module.exports ={
    name: 'gif',
    description: "Mande um GIF!",
    args: '(Tema)',
    async execute(message, args, client) {
        const searchTerm = !args[1] ? 'pudim' : args[1]
        const response = await nodeFetch(`https://g.tenor.com/v1/search?q=${searchTerm}&key=${process.env.TENORKEY}&ContentFilter=high`)
        const json = await response.json()
        const gifPost = json.results[Math.floor(Math.random() * json.results.length)]

        const gifEmbed = new MessageEmbed()
            .setTitle('Aqui está seu gif!')
            .setImage(gifPost.media[0].gif.url)
            .setURL(gifPost.url)
            .setFooter(client.footer)
            .setTimestamp()
        message.reply({embeds: [gifEmbed]})
    }
}
