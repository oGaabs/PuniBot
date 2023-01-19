const Command = require('../../utils/base/Command.js')

class Flip extends Command {
    constructor(client) {
        super(client, {
            name: 'flip',
            aliases: ['moeda', 'girar', 'cara', 'coroa', 'sorte', '50%', 'caracoroa'],
            description: 'Cara ou coroa',
            category: 'entretenimento'
        })
    }

    async execute (message, _args, _client){
        const coinMessage = await message.reply('**Girando...**')
        setTimeout(() => coinMessage.edit(Math.round(Math.random()) ? '**CARA**' : '**COROA**'), 3000)
    }
}

module.exports = Flip

