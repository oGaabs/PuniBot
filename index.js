require('dotenv').config()

const startHost = require('./host')
startHost()

const { Intents } = require('discord.js')
const PuniBot = require('./PuniBot')
const client = new PuniBot({ intents: new Intents(32767) })

client.once('ready', async () => {
    const botOwner = await client.application.fetch().then(app => client.users.fetch(app.owner))

    client.guild = client.guilds.cache.get('926539282733203546')
    client.canais = client.channels.cache
    client.initListeners('./listeners')
    client.initCommands('./commands')

    const dmChannel = botOwner.dmChannel ?? await botOwner.createDM()
    const botOldMessages = await dmChannel.messages.fetch({ limit: 100 })

    botOldMessages.forEach(message => {
        if (message.author.id === client.user.id)
            message.delete()
    })

    botOwner.send('Estou online 🤨👍').then(async startMessage => {
        const finalMessage = await botOwner.send('**Calculando...**')
        const botPing = finalMessage.createdTimestamp - startMessage.createdTimestamp
        const apiPing = Math.round(client.ws.ping)

        botOwner.send(`Bot Latency: ${botPing} ms, API Latency: ${apiPing} ms`).then(botStatistic => {
            finalMessage.delete()
            console.log(botStatistic.content + '\n')
        })
    })

    console.log(`Memory: ${Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100} MB`)
})

process.on('unhandledRejection', error => {
    console.log(`Erro : ${error}\nLogando novamente...`, error)
    client.destroy()
    botLogin()
})

function botLogin() {
    client.login(process.env.TOKEN)
        .then(() => console.log(`\nLogado como ${client.user.tag}.`))
        .catch(err => console.log(`Falha ao iniciar o bot : ${err}`))
}

botLogin()