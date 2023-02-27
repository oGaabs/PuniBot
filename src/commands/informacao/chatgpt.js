const Command = require('../../utils/base/Command.js')

const { EmbedBuilder, codeBlock } = require('discord.js')
const moment = require('moment')
moment.locale('pt-br')

const axiosChatGPT = require('../../api/chatgpt.js')

class ChatGPT extends Command {
    constructor(client) {
        super(client, {
            name: 'chatgpt',
            aliases: ['chatgpt3', 'gpt', 'perguntar', 'ia', 'chatia'],
            description: 'OpenAI’s GPT-3 model',
            category: 'informação',
            args: '(Pergunta)'
        })

        this.axiosChatGPT = axiosChatGPT
        this.params = {
            model: 'text-davinci-003',
            prompt: 'Olá, eu sou o chatgpt3, como você está?',
            max_tokens: 500,
            temperature: 0.5,
        }
        this.responseImages = [
            'https://entretetizei.com.br/wp-content/uploads/2021/03/divertidamente-capa.jpg',
            'https://i.giphy.com/media/cW1PvoyY7YCAw/giphy.gif',
            'https://i.giphy.com/media/z1At622oKNTCo/giphy.gif',

            'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmMxODAwNTJmMmRkZGM0MGM5OGYzNzY2MmU4ZGQ3ZTVjNjczZjVhNiZjdD1n/AWJXatVJJoPVS/giphy.gif',

            'https://i.giphy.com/media/dLFzYOICS8Ksw/giphy.gif',

            'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzBkYzhhMmRmZTAyZDI1NDRjNjJjNWU3YjBkNjMxODY1YjgxN2MzYSZjdD1n/tFdgUtHh80hFK/giphy.gif',
            'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTIxNGMxNGI2NGUzZGI4ODY0NjcwYWJlNWIwN2FjM2IwMjQ0YjU4ZCZjdD1n/mWgxAG0ZMZTji/giphy.gif',
            'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTZiZmQwODAyNDg3NWNjNjdlODExNTFhZDJlMDYzMDA0MjM0YjZkYyZjdD1n/SU3kZRnpJnEK4/giphy.gif',

            'https://i.giphy.com/media/7dQaPwR4hYiIw/giphy.gif',
            'https://i.giphy.com/media/t4Nx7bCzv7dTy/200w.gif',
            'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzliMDcyMTBmMjgxZTFiYjY2NWFiZDlkMzQ3YjE4MDY3NzVlMjQxMiZjdD1n/14qUSmdzooyi8o/giphy.gif',


            'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzVjMWRiNWQxNDE3YTA3M2RmMDRjODMwOGJjMjIzNzRlZjkwNmQyMyZjdD1n/MCWzBFZoE4zm/giphy.gif'
        ]
        this.emojis = [
            '😘', '😍', '😎', '😉', '😜', '😝', '😛',
            '😋', '😇', '😏'
        ]
    }

    getParams(question) {
        const params = {
            ...this.params,
            prompt: question
        }

        return params
    }

    getRandImage() {
        const rand = Math.floor(Math.random() * this.responseImages.length)
        return this.responseImages[rand]
    }

    getRandEmoji() {
        const rand = Math.floor(Math.random() * this.emojis.length)
        return this.emojis[rand]
    }

    async execute(message, args, _client) {
        if (!args[0]) return message.reply('Você precisa me perguntar algo!')

        const userQuestion = this.getParams(args.join(' '))

        const waitMessage = await message.reply('Pensando...')

        const chatGPTResponse = await this.axiosChatGPT
            .post('', userQuestion)
            .then(res => res.data.choices[0].text)
            .catch(err => console.log(err))

        await waitMessage.delete()

        if (!chatGPTResponse)
            return message.reply('Não consegui responder sua pergunta!')

        let userName = message.member?.user?.username ?? ''

        const titleEmbed = new EmbedBuilder()
            .setTitle('ChatGPT3 - IA ' + this.getRandEmoji())

        const questionEmbed = new EmbedBuilder()
            .setAuthor({ name: userName, iconURL: message.member.user.displayAvatarURL({ dynamic: true, size: 1024 }) })
            .setColor(this.client.colors['green'])
            .addFields(
                { name: 'Pergunta', value: codeBlock('yaml', args.join(' ')) },
            )

        const chatEmbed = new EmbedBuilder()
            .setAuthor({ name: 'ChatGPT3', iconURL: this.client.user.displayAvatarURL({ dynamic: true, size: 1024 }) })
            .setColor(this.client.colors['green'])
            .addFields(
                { name: 'Resposta', value: codeBlock('js', chatGPTResponse) }
            )
            .setFooter(this.client.getFooter(message.guild))
            .setTimestamp()

        const imageEmbed = new EmbedBuilder()
            .setThumbnail(this.getRandImage())

        message.reply({ embeds: [titleEmbed, questionEmbed, chatEmbed, imageEmbed] })
    }
}

module.exports = ChatGPT
