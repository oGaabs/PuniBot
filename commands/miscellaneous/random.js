module.exports = {
    name: 'random',
    aliases: ['aleatorio', 'rand', 'rnd'],
    description: 'Número aleatório!',
    args: '(10-30)',
    execute: async (message, args, _client) => {
        if (!args[0]) return message.reply(getRandomIntegerInRange().toString())

        let limits = args[0].split('-')
        if (isNaN(parseFloat(limits[0])) ||
            isNaN(parseFloat(limits[1])) ||
            limits[1] > Number.MAX_SAFE_INTEGER)
            return message.reply(`Insira apenas números!\nEX: ${client.prefix} random 1-20`)

        message.reply(getRandomIntegerInRange(limits[0], limits[1]).toString())
    }
}

function getRandomIntegerInRange(min = 0, max = Number.MAX_SAFE_INTEGER) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min
}
