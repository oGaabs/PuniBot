module.exports = async function botActivity(client) {
    const guild = client.guilds.cache.get('926539282733203546')
    const { user: puniBot,
            tag: botTag ,
            prefix: botPrefix } = client

    const botStatus = ['online', 'dnd', 'idle']

    setInterval(() => {
        const activities = [
            { name: '🎥 Cineminha com Gabs!', type: 'STREAMING', url: 'https://www.netflix.com/watch/81073022?trackId=14170033&tctx=1%2C0%2Cbb356764-ae2a-42ea-afac-69e403b2ac9e-42496442%2C09551ab6-8494-4e9b-bdca-5f41cf065a47_24951814X9XX1641901381014%2C09551ab6-8494-4e9b-bdca-5f41cf065a47_ROOT%2C%2C%2C' },
            { name: '🍮 Como fazer um pudim?', type: 'PLAYING' },
            { name: `${guild.memberCount} membros 🥳`, type: 'PLAYING' },
            { name: `${botTag} ✔️`, type: 'PLAYING' },
            { name: `${botPrefix} help`, type: 'PLAYING' },
            { name: 'Sem minha crush 💔', type: 'PLAYING' },
            { name: 'Cade minha melhor amiga?', type: 'PLAYING' },
            { name: '🏆 Anda perdido ? me mencione!', type: 'PLAYING' },
            { name: '🔑 Entre em contato para reportar qualquer bug.', type: 'PLAYING' },
            { name: '🍮 Pudim na lua?', type: 'PLAYING' },
            { name: '🍮 Desfrute de um belo pudim', type: 'PLAYING' },
            { name: 'Gabs Gabs Gabs', type: 'PLAYING' },
            { name: '👩‍🚀 Mais Comandos legais para Você!', type: 'PLAYING' }
        ]
        const randomActivity = activities[Math.floor(Math.random() * activities.length)]
        const randomStatus = botStatus[Math.floor(Math.random() * botStatus.length)]

        puniBot.setPresence({ activities: [randomActivity], status: randomStatus })
    }, 20000)
}
