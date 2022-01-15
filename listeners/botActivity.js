module.exports = async function botActivity (client){
    const guild = client.guild
    const user = client.user
    const stats = ['online', 'dnd', 'idle']
    setInterval(() =>{
        user.setStatus(stats[Math.floor(Math.random() * stats.length)])
    }, 20000)

    const status = [
        { name: '🎥 Cineminha!', type: 'STREAMING', url: 'https://www.netflix.com/watch/81073022?trackId=14170033&tctx=1%2C0%2Cbb356764-ae2a-42ea-afac-69e403b2ac9e-42496442%2C09551ab6-8494-4e9b-bdca-5f41cf065a47_24951814X9XX1641901381014%2C09551ab6-8494-4e9b-bdca-5f41cf065a47_ROOT%2C%2C%2C' },
        { name: '🍮 Como fazer um pudim?', type: 'PLAYING'},
        { name: `${guild.memberCount} membros 🥳`, type: 'PLAYING' },
        { name: `${user.tag} ✔️`, type: 'PLAYING'  },
        { name: `${client.prefix} help`, type: 'PLAYING' },
        { name: 'Sem minha crush 💔', type: 'PLAYING' },
        { name: '🏆 Anda perdido ? me mencione!', type: 'PLAYING' },
        { name: '🔑 Entre em contato para reportar qualquer bug.', type: 'PLAYING' },
        { name: '🍮 Pudim na lua?', type: 'PLAYING' },
        { name: '🍮 Desfrute de um belo pudim', type: 'PLAYING' },
        { name: '🍮 Pudim Pudim Pudim', type: 'PLAYING' },
        { name: '👩‍🚀 Mais Comandos legais para Você!', type: 'PLAYING' }
    ]
    setInterval(() =>{
        user.setActivity(status[Math.floor(Math.random() * status.length)])
    }, 20000)
}