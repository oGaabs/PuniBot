module.exports = async function memberCount(client) {
    const guild = client.guilds.cache.get('926539282733203546')
    const channel = client.channels.cache.get('927167938706931752')
    setInterval(() => {
        const memberCount = guild.memberCount
        channel.setName(`👥 Membros: ${memberCount}`)
    }, 10000)
}