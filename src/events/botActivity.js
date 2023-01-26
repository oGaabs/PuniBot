const { ActivityType } = require('discord.js')

const INTERVAL_CHANGE_PRESENSE = 20000

async function botActivity(client) {
    const guild = client.guilds.cache.get('926539282733203546')
    const { user: puniBot, tag: botTag, prefix: botPrefix } = client

    const botStatus = ['online', 'dnd', 'idle']

    setInterval(() => {
        const activities = [
            { name: '🎥 Cineminha com Gabs!', type: ActivityType.Streaming, url: 'https://www.netflix.com/br/title/80996601' },
            { name: '🍮 Como fazer um pudim?', type: ActivityType.Playing },
            { name: `${guild.memberCount} membros 🥳`, type: ActivityType.Playing },
            { name: `${botTag} ✔️`, type: ActivityType.Playing },
            { name: `${botPrefix} help`, type: ActivityType.Playing },
            { name: 'Sem minha crush 💔', type: ActivityType.Playing },
            { name: 'Cade minha melhor amiga?', type: ActivityType.Playing },
            { name: '🏆 Anda perdido ? me mencione!', type: ActivityType.Playing },
            { name: '🔑 Entre em contato para reportar qualquer bug.', type: ActivityType.Playing },
            { name: '🍮 Pudim na lua?', type: ActivityType.Playing },
            { name: '🍮 Desfrute de um belo pudim', type: ActivityType.Playing },
            { name: 'Gabs Gabs Gabs', type: ActivityType.Listening },
            { name: 'Amor de Bot', type: ActivityType.Competing },
            { name: '👩‍🚀 Mais Comandos legais para Você!', type: ActivityType.Playing }
        ]
        const randomActivity = activities[Math.floor(Math.random() * activities.length)]
        const randomStatus = botStatus[Math.floor(Math.random() * botStatus.length)]

        puniBot.setPresence({ activities: [randomActivity], status: randomStatus })
    }, INTERVAL_CHANGE_PRESENSE)
}

module.exports = botActivity