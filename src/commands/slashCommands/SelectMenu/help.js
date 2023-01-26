module.exports = {
    name: 'help-menu',
    aliases: [],
    description: 'Lista de comandos!',
    category: 'informação',
    execute: async (interaction, client) => {
        let categoryName = interaction.values[0]

        const command = client.commands.get('help')
        if (!command) return

        if (categoryName == 'voltar')
            categoryName = null

        command.execute(interaction.message, [categoryName], client, true)
    }
}
