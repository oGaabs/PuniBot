module.exports ={
    name: 'free',
    description: "Send free games!",
    async execute(message) {
        const freeGames = require(process.cwd() +'/listeners/freeGames.js')
        freeGames.sendGames(message.channel.id)
    }
}