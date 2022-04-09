require('dotenv').config()

const startHost = require('./host')
startHost()

const { Intents } = require('discord.js')
const PuniBot = require('./PuniBot')
const client = new PuniBot({ intents: new Intents(32767) })

client.once('ready', async () => {
    const botOwner = await client.application.fetch().then(app => client.users.fetch(app.owner))

    client.botOwner = botOwner
    client.tag = client.user.tag
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

        botOwner.send(`Bot Latency: ${botPing} ms, API Latency: ${apiPing} ms`)
        finalMessage.delete()

        client.logger.warn('',`\n[${client.logger.getDate()}] PuniBOT is ready!`, true)
        client.logger.error('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=','', true)
        client.logger.debug('Bot: ', client.tag, true)
        client.logger.debug('Status: ', 'Initialized', true)
        client.logger.debug('Memory: ', `${Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100}/1024 MB`, true)
        client.logger.debug('Bot Latency: ',`${botPing} ms`, true)
        client.logger.debug('API Latency: ',`${apiPing} ms`, true)
        client.logger.error('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=','\n', true)
    })
})

client.loginBot(process.env.TOKEN)