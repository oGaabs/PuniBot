const Command = require('../../utils/base/Command.js')

const { EmbedBuilder } = require('discord.js')
const nodeFetch = require('node-fetch')

class Word extends Command {
    constructor(client) {
        super(client, {
            name: 'word',
            aliases: ['palavra', 'significado', 'dicionario', 'info', 'meaning',
                'mean', 'urban', 'sig', 'dic', 'wrd', 'w'],
            description: 'Significado da palavra!',
            category: 'informação',
            args: '(palavra)'
        })
    }

    async execute(message, args, client) {
        const searchTerm = args[0] || 'pudim'
        const msg = await message.reply('**Procurando significado...**')

        const response = await nodeFetch(`https://significado.herokuapp.com/${searchTerm}`)
            .then(async res => res.ok ? await res.json() : null)

        msg.delete()
        if (response === null) return msg.channel.send(`Palavra não encontrada.\nUtilize ${client.prefix} word livro`)

        response.forEach(wordInfo => {
            const meaningEmbed = getMeaningEmbed(wordInfo)
            message.channel.send({ embeds: [meaningEmbed] })
        })

        function getMeaningEmbed(wordInfo) {
            const { class: wordClass,
                meanings: wordMeanings,
                etymology: wordEtymology } = JSON.parse(JSON.stringify(wordInfo).replace('\\"\\"', '\\"Não fornecido\\"'))
            const meaningEmbed = new EmbedBuilder()
                .setColor(client.colors['alert'])
                .setTitle(searchTerm.toUpperCase())
                .setURL(`https://www.google.com/search?q=${searchTerm}`)
                .addFields(
                    { name: 'Classe', value: wordClass },
                    { name: 'Definição', value: wordMeanings.join(' ') },
                    { name: 'Etimologia', value: wordEtymology },
                )
            return meaningEmbed
        }
    }
}

module.exports = Word

