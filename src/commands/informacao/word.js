const Command = require('../../utils/base/Command.js')

const { EmbedBuilder } = require('discord.js')

let axios = require('axios')

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

        axios = axios.create({
            baseURL: 'https://dicio-api-ten.vercel.app/v2/',
            timeout: 10000
        })
    }

    errorHandler(axiosError, message, searchTerm) {
        const { status, statusText } = axiosError.response

        let errorMessage = ''
        switch (status) {
            case 400:
                errorMessage = `Palavra ${searchTerm} inválida. Tente usar palavras em português`
                break
            case 404:
                errorMessage = `Palavra ${searchTerm} não encontrada .\nUtilize ${this.client.prefix} word livro`
                break
            case 503:
                errorMessage = 'API fora do ar no momento, tente mais tarde'
                break
            default:
                errorMessage = 'Erro ao procurar significado de ${searchTerm}'
                break
        }

        const errorEmbed = new EmbedBuilder()
            .setColor(this.client.colors['alert'])
            .setTitle('⚠ | ' + errorMessage)
            .setDescription(`📕 Status: ${statusText}`)

        message.channel.send({ embeds: [errorEmbed] })
    }

    async execute(message, args, client) {
        const searchTerm = args[0] || 'pudim'
        const msg = await message.reply('**Procurando significado...**')

        const response = await axios(searchTerm).catch((res) => {
            this.errorHandler(res, message, searchTerm)
        })
        if (!response) return

        msg.delete()

        if (response.data.length === 0) return msg.channel.send(`Palavra não encontrada.\nUtilize ${client.prefix} word livro`)

        for (const wordInfo of response.data) {
            const meaningEmbed = this.createMeaningEmbed(wordInfo, searchTerm)
            message.channel.send({ embeds: [meaningEmbed] })
        }
    }

    createMeaningEmbed(wordSearch, searchedTerm) {
        wordSearch = this.replaceEmptyInfo(wordSearch)

        const wordInfo = {
            class: this.replaceEmptyInfo(wordSearch.partOfSpeech),
            meanings: this.replaceEmptyInfo(wordSearch.meanings),
            etymology: this.replaceEmptyInfo(wordSearch.etymology)
        }

        if (wordInfo.meanings.length > 6)
            wordInfo.meanings = wordInfo.meanings.slice(0, 6)

        const meaningEmbed = new EmbedBuilder()
            .setColor(this.client.colors['alert'])
            .setTitle(searchedTerm.toUpperCase())
            .setURL(`https://www.google.com/search?q=${searchedTerm}`)
            .addFields(
                { name: '📚 Classe', value: wordInfo.class },
                { name: '📝 Definição', value: wordInfo.meanings.join(' ') },
                { name: '🗺 Etimologia', value: wordInfo.etymology },
            )
        return meaningEmbed
    }

    replaceEmptyInfo(wordInfo) {
        Object.keys(wordInfo).forEach(info => {
            if (wordInfo[info] === '') 
                wordInfo[info] = 'Não fornecido'
        })

        return wordInfo
    }
}

module.exports = Word
