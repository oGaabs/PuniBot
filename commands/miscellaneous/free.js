module.exports ={
    name: 'free',
    description: "Send free games!",
    execute: async (message) => {
        const freeGames = require(process.cwd() +'/listeners/freeGames.js')
        freeGames.sendGames(message.channel.id)
    }
}