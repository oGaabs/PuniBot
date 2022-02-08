module.exports = async function autoRole(client) {
    const guild = client.guild
    const separadorRole = guild.roles.cache.get('926709141014196265')
    const viajanteRole = guild.roles.cache.get('930038268173643808')
    const botRole = guild.roles.cache.get('926567305155055717')
    setInterval(() => {
        const members = guild.members.cache.filter(m => !m.user.bot)
        members.forEach(member => member.roles.add([separadorRole, viajanteRole]))

        const bots = guild.members.cache.filter(m => m.user.bot)
        bots.forEach(member => member.roles.add(botRole))
    }, 50000)
}