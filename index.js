require("dotenv").config()

const startHost = require('./host')
startHost()

const { Intents } = require('discord.js')
const PuniBot = require('./PuniBot')
const client = new PuniBot({ intents: new Intents(32767) })

client.once('ready', async () => {
    client.guild = client.guilds.cache.get('926539282733203546')
    client.canais = client.channels.cache
    client.initListeners('./listeners')
    client.initCommands('./commands')
    client.users.fetch('407734609967841299', false).then((owner) => {
        owner.createDM().then(dmChannel => {
            dmChannel.messages.fetch({ limit: 100 })
                .then((messages) => {
                    messages = messages.filter(m => { return m.author.id === client.user.id })
                    messages.forEach(message => {
                        message.delete()
                    })
                })
            owner.send('Estou online 🤨👍').then(message => {
                message.reply('**Calculando...**').then(m => {
                    const ping = m.createdTimestamp - message.createdTimestamp
                    m.delete()
                    owner.send(`Bot Latency: ${ping} ms, API Latency: ${Math.round(client.ws.ping)} ms`).then(m => {
                        console.log(m.content + '\n')
                    })
                })
            })
        })
    })
    console.log(`Memory: ${Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100} MB`)
})

process.on('unhandledRejection', error => {
    console.log('Erro : ', error)
    console.log('\nLogando novamente...')
    client.destroy()
    botLogin()
})

function botLogin() {
    client.login(process.env.TOKEN)
        .then(() => {
            console.log(`\nLogado como ${client.user.tag}.`)
        })
        .catch(err => {
            console.log(`Falha ao iniciar o bot : ${err}`)
        })
}

botLogin()