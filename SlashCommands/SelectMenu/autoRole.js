module.exports = {
    name: 'autorole-menu',
    aliases: [],
    description: 'Exibe os cargos.',
    category: 'outros',
    execute: async (interaction, _client) => {
        const gameRoleSeparator = interaction.message.guild.roles.cache.find(role => role.id === '974497776757010452')
        const member = interaction.member
        let roles = interaction.values
        if (!roles) return

        roles = roles.map(roleId => {
            const roleObject = interaction.message.guild.roles.cache.find(r => r.id === roleId)
            return roleObject
        })
        if (roles.length == 0) return

        roles.push(gameRoleSeparator)

        member.roles.add(roles)
    }
}
