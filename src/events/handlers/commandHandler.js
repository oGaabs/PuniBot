const { ChannelType } = require('discord.js')

module.exports = async function onMessage(client) {
    const { prefix, commands } = client
    client.on('messageCreate', async message => {
        if (message.channel.type === ChannelType.DM || message.author.bot) return

        if (!message.content.toLowerCase().startsWith(prefix)) {
            if (!message.mentions.has(client.user)) return

            // Manda uma mensagem de ajuda quando o usuario mencionar o bot
            return commands.get('help').execute(message, null, client)
        }

        let args = message.content.slice(prefix.length).trim().split(/\s+/)
        if (!args) return

        const commandName = args[0].toLowerCase()
        const command = client.getCommand(commandName)
        if (!command) return

        args.shift() // Remove command name from args
        command.execute(message, args, client)
    })

    client.on('interactionCreate', async (interaction) => {
        // SelectMenu Handling
        if (interaction.isStringSelectMenu()) {
            await interaction.deferUpdate({ ephemeral: false })
            const selectMenu = client.slashCommands.get(interaction.customId)
            if (!selectMenu) return

            return selectMenu.execute(interaction, client)
        }
    })
}
