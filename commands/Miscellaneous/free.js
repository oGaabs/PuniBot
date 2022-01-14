const freeGamesFunction = require(process.cwd() +'/listeners/freeGames.js')
const sendGames = freeGamesFunction.sendGames
module.exports ={
    name: 'free',
    description: "Send free games!",
    async execute(message) {
        sendGames(message.channel.id)
    }
}
