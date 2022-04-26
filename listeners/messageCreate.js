module.exports = async function onMessage(client) {
    const { prefix, commands } = client
    client.on('messageCreate', async message => {
        if (message.channel.type === 'DM' || message.author.bot) return
        if (!message.content.toLowerCase().startsWith(prefix)) {
            if (!message.mentions.has(client.user)) return
            return commands.get('help').execute(message, null, client)
        }
        let args = message.content.slice(prefix.length).trim().split(/\s+/)
        if (!args) return

        const commandName = args[0].toLowerCase()
        const command = commands.find(cmd => cmd.name === commandName || (cmd.aliases && cmd.aliases.includes(commandName)))
        if (!command) return

        args.shift()
        command.execute(message, args, client)
    })
}
