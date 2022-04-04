module.exports = async function memberCount(client) {
    const guild = client.guild
    const channel = client.canais.get('927167938706931752')
    setInterval(() => {
        const memberCount = guild.memberCount
        channel.setName(`👥 Membros: ${memberCount}`)
    }, 10000)
}