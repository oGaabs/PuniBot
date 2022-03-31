module.exports = {
    name: 'flip',
    aliases: ['moeda', 'girar', 'cara', 'coroa',
        'sorte', '50%', 'caracoroa'],
    description: 'Cara ou coroa',
    execute: async (message, _args, _client) => {
        const coinMessage = await message.reply('**Girando...**')
        setTimeout(() => coinMessage.edit(Math.round(Math.random()) ? '**CARA**' : '**COROA**'), 3000)
    }
}