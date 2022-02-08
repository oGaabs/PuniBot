const Fs = require('fs')

module.exports = async function onMessage(client) {
    const prefix = client.prefix
    const commands = client.commands
    client.on('messageCreate', async message => {
        if (message.author.bot) return
        if (message.mentions.has(client.user)) commands.get('help').execute(message, '', client)
        if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return
        const args = message.content.slice(prefix.length).split(/ +/)
        args.shift()
        const command = args[0].toLowerCase()
        if ((initCommands('commands', command)))
            commands.get(command).execute(message, args, client)
    })

    function initCommands(path, command) {
        let result = false
        Fs.readdirSync(path).forEach(file => {
            try {
                let filePath = path + '/' + file
                if (file.endsWith('.js') && file.replace('.js', '') === command)
                    result = true
                if (Fs.lstatSync(filePath).isDirectory()) {
                    if (initCommands(filePath, command))
                        result = true
                }
            }
            catch (err) {
                console.error(err)
            }
        })
        return result
    }
}