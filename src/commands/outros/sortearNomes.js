const Command = require('../../utils/base/Command.js')

class SortearNomes extends Command {
    constructor(client) {
        super(client, {
            name: 'sortearNomes',
            aliases: ['sortear','sorteioNomes','alegrupo','aleatorizargrupo', 'grupornd'],
            description: 'Elemento aleatório do grupo',
            category: 'outros',
            args: '(Eu Tu Ele Ela)'
        })
    }

    async execute (message, args, client){
        if (!args[0]) return message.reply(`Digite um grupo. \nEx: ${client.prefix} alegrupo Eu Tu Ele Ela `)
        return message.reply(this.getRandomElemInArray(args))
    }

    getRandomElemInArray(array) {
        return array[Math.floor(Math.random() * array.length)]
    }
}

module.exports = SortearNomes

