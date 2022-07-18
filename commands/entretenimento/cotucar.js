const Command = require('../../utils/base/Command.js')

class Cotucar extends Command {
    constructor(client) {
        super(client, {
            name: 'cotucar',
            aliases: ['ctc'],
            description: 'Cotuca um usuario',
            category: 'entretenimento',
            args: '@(Pessoa1)'
        })
    }

    async execute (message, _args, client){
        let user = message.mentions.users.first()
        if (!user || user.length < 1) {
            return message.reply('Mencione corretamente a pessoa que você quer cotucar\n' +
                `Exemplo: ${client.prefix} cotucar <@407734609967841299>`)
        }

        if (user.id == '407734609967841299' || user.id == '382990022191874048') {
            message.reply('https://tenor.com/view/no-u-gif-21943443')
            user = message.member.user
        }

        message.channel.send(`👉 ${user} recebeu uma cotucada !`)

        client.getCommand('fake').execute(message, ['', client.formatter.userMention(user.id),'😳'], client, true)
    }
}

module.exports = Cotucar


