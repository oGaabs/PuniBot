require('dotenv').config()


const { GatewayIntentBits, Events } = require('discord.js')
const startHost = require('./src/config/server')
const PuniBot = require('./src/PuniBot')

const client = new PuniBot({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.once(Events.ClientReady, async () => {
    const botOwner = await client.application.fetch().then(app => client.users.fetch(app.owner))

    client.botOwner = botOwner
    client.tag = client.user.tag
    client.initListeners('./src/events')
    client.initCommands('./src/commands')
    client.initSlashCommands('./src/commands/slashCommands')

    const dmChannel = botOwner.dmChannel ?? await botOwner.createDM()
    const botOldMessages = await dmChannel.messages.fetch({ limit: 100 })

    // Exclui mensagens antigas do bot enviadas ao dono por DM
    botOldMessages.forEach(message => {
        const isMessageFromBot = message.author.id === client.user.id
        if (isMessageFromBot)
            message.delete()
    })

    // Calcula o ping do bot e manda a mensagem para o dono via DM
    botOwner.send('Test | Estou online 🤨👍').then(async startMessage => {
        const finalMessage = await botOwner.send('**Calculando...**')
        const botPing = finalMessage.createdTimestamp - startMessage.createdTimestamp
        const apiPing = Math.round(client.ws.ping)

        // Advise owner via DM about the bot's ping
        botOwner.send(`Bot Latency: ${botPing} ms, API Latency: ${apiPing} ms`)
        finalMessage.delete()

        // Printa/Debuga o status do bot
        client.logger.warn('', `\n[${client.logger.getDate()}] PuniBOT is ready!`)
        client.logger.alert('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=', '')
        client.logger.debug('Bot: ', client.tag)
        client.logger.debug('Status: ', 'Initialized')
        client.logger.debug('Memory: ', `${Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100}/1024 MB`)
        client.logger.debug('Bot Latency: ', `${botPing} ms`)
        client.logger.debug('API Latency: ', `${apiPing} ms`)
        client.logger.alert('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=', '\n')
    })
})

// Loga na Discord API com o token do seu bot
client.loginBot(process.env.CLIENT_TOKEN)
startHost()
