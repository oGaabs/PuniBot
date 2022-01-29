const { MessageEmbed } = require('discord.js')
const nodeFetch = require('node-fetch')

module.exports ={
    name: 'gif',
    description: "Mande um GIF!",
    args: '(Tema)',
    async execute(message, args, _client) {
        const searchTerm = !args[1] ? 'pudim' : args[1]
        const url = `https://g.tenor.com/v1/search?q=${searchTerm}&key=${process.env.TENORKEY}&ContentFilter=high`
        const response = await nodeFetch(url)
        const json = await response.json()
        const gifIndex = Math.floor(Math.random() * json.results.length)
        message.reply(json.results[gifIndex].url)
    }
}
