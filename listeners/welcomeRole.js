module.exports = async function autoRole(client) {
    setInterval(() => {
        const guild = client.guilds.cache.get('926539282733203546')

        const roleSeparator = guild.roles.cache.get('926709141014196265')
        const welcomeRole = guild.roles.cache.get('930038268173643808')

        const botRole = guild.roles.cache.get('926567305155055717')

        const [bots, members] = guild.members.cache.partition(m => m.user.bot)

        members.forEach(member => member.roles.add([roleSeparator, welcomeRole]))
        bots.forEach(member => member.roles.add(botRole))
    }, 25000)
}
