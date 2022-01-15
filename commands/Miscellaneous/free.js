const freeGamesFunction = require(process.cwd() +'/listeners/freeGames.js')
module.exports ={
    name: 'free',
    description: "Send free games!",
    async execute(message) {
        const sendGames = freeGamesFunction.sendGames
        sendGames(message.channel.id)
    }
}
