module.exports = {
    name: 'random',
    description: "Número aleatório!",
    args: '(10-30)',
    execute: async (message, args, _client) => {
        if (!args[1]) return message.reply(generateRandomIntegerInRange().toString())

        let limits = args[1].split('-')
        if (isNaN(parseFloat(limits[0])) || isNaN(parseFloat(limits[1]))) return message.reply('Insira apenas números!\nEX: !p random 1-20')

        message.reply(generateRandomIntegerInRange(limits[1], limits[0]).toString())
    }
}

function generateRandomIntegerInRange(min = 0, max = Number.MAX_SAFE_INTEGER) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min
}
