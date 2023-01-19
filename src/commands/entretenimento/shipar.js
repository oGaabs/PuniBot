const Command = require('../../utils/base/Command.js')

const { EmbedBuilder } = require('discord.js')
const { gifSearch } = require('../../utils')

class Shipar extends Command {
    constructor(client) {
        super(client, {
            name: 'shipar',
            aliases: ['tolove', 'tolover', 'love', 'amor', 'ship',
                'matchmaking', 'match', 'tinder'],
            description: 'É um Amor verdadeiro?',
            category: 'entretenimento',
            args: '@(Pessoa1) @(Pessoa2)'
        })
    }

    async execute(message, _args, client) {
        const users = message.mentions.users.first(2)
        if (!users || users.length < 1) {
            return message.reply('Mencione corretamente os apaixonados\n' +
                `Exemplo: ${client.prefix} tolove <@407734609967841299> <@382990022191874048>`)
        }
        const pessoa1 = users.at(0)
        const pessoa2 = users.at(1) ? users.at(1) : message.author

        const searchTerm = 'anime crush'
        const gif = await gifSearch.getGif(searchTerm)

        const lovePercentage = Math.floor(Math.random() * 101) // Porcentagem de amor
        const loveLevel = Math.floor(lovePercentage / 6) // Define a quantidade de corações

        const loveHeartBar = '💗'.repeat(loveLevel) + '🤍'.repeat(16 - loveLevel)

        const frasesResultantes = [
            { frase: '**Uhm.. Não deu match! 💔😭**', max: 12 }, //  até 12 %
            { frase: '**Não foi dessa vez amigão 🖋️💔**', max: 22 }, // até 22%
            { frase: '**Melhor chamar pra sair logo, se não perde 🍽️🍔**', max: 32 }, // até 32%
            { frase: '**Se os dois quiserem, talvez dê certo... Mas...**', max: 45 }, // até 45%
            { frase: '**Teria dado certo, se não tivesse ficado na friendzone 💚👫🏻**', max: 54 }, // até 54%
            { frase: '**Todo mundo já sabe desse casal 👀💑**', max: 73 }, // até 73%
            { frase: '**Uhm.. Vai dar namoro! 💋💘**', max: 85 }, // até 85%
            { frase: '**Temos um novo casal 💍💑!**', max: 100 } // até 100%
        ]
        let frase
        for (const element of frasesResultantes) {
            const fraseIndex = element
            const maxRange = fraseIndex.max
            if (lovePercentage <= maxRange) {
                frase = fraseIndex.frase
                break
            }
        }

        const loveEmbed = new EmbedBuilder()
            .setTitle(frase)
            .setColor(client.colors['default'])
            .setImage(gif.image)
            .setURL(gif.url)
            .addFields([
                { name: '⁣', value: `** ${Math.floor(lovePercentage)}% [ ${loveHeartBar} ] **` }
            ])
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()

        await message.channel.send({
            content: '💗 **MATCHMAKING **💗\n' +
                `🔻${pessoa1}\n` +
                `🔺${pessoa2}`,
            embeds: [loveEmbed]
        })
    }
}

module.exports = Shipar
