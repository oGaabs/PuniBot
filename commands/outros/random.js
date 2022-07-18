const Command = require('../../utils/base/Command.js')

class Random extends Command {
    constructor(client) {
        super(client, {
            name: 'random',
            aliases: ['aleatorio', 'rand', 'rnd'],
            description: 'Número aleatório!',
            category: 'outros',
            args: '(10-30)'
        })
    }

    async execute (message, args, client){
        if (!args[0]) return message.reply(this.getRandomIntegerInRange().toString())

        let limits = args[0].split('-')
        if (isNaN(parseFloat(limits[0])) ||
            isNaN(parseFloat(limits[1])) ||
            limits[1] > Number.MAX_SAFE_INTEGER)
            return message.reply(`Insira apenas números!\nEX: ${client.prefix} random 1-20`)

        message.reply(this.getRandomIntegerInRange(limits[0], limits[1]).toString())
    }

    getRandomIntegerInRange(min = 0, max = Number.MAX_SAFE_INTEGER) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}

module.exports = Random

