module.exports = {
    name: 'sortearNomes',
    aliases: ['sortear','sorteioNomes','alegrupo','aleatorizargrupo', 'grupornd'],
    description: 'Elemento aleatório do grupo',
    category: 'Outros',
    args: '(Eu Tu Ele Ela)',
    execute: async (message, args, client) => {
        if (!args[0]) return message.reply(`Digite um grupo. \nEx: ${client.prefix} alegrupo Eu Tu Ele Ela `)
        return message.reply(getRandomElemInArray(args))
    }
}

function getRandomElemInArray(array) {
    return array[Math.floor(Math.random() * array.length)]
}
