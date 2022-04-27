const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'fight',
    aliases: ['batalhar', 'batalha', 'lutar', 'luta','desafio'],
    description: 'Lutar contra outro usuário!',
    args: '@(Pessoa1) @(Pessoa2)',
    execute: async (message, _args, client) => {
        const users = message.mentions.users.first(2)
        if (!users || users.length < 1) {
            return message.reply('Mencione corretamente os desafiantes\n' +
                `Exemplo: ${client.prefix} fight <@407734609967841299> <@382990022191874048>`)
        }

        const desafiantes = []
        desafiantes[0] = users.at(0)
        desafiantes[1] = users.at(1) ?? message.author

        const vencedor = Math.round(Math.random()) ? desafiantes[0] : desafiantes[1]
        const perdedor = desafiantes[0] !== vencedor ? desafiantes[0] : desafiantes[1]

        const searchTerm = 'anime fight'
        const gif = await client.gifSearch.getGif(searchTerm)

        const fightEmbed = new MessageEmbed()
            .setTitle('⚔️ | Batalha está prestes a começar!')
            .setColor(client.colors['default'])
            .setImage(gif.image)
            .setURL(gif.url)
            .setDescription(`**Desafiante 1:** ${desafiantes[0]} e **Desafiante 2**: ${desafiantes[1]}\n`)
            .addField('Resultado da Batalha:\n', getResultadoDaBatalha(vencedor, perdedor))
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()

        message.reply({ embeds: [fightEmbed] })
    }
}

function getResultadoDaBatalha(vencedor, perdedor) {
    const frasesVencedor = [
        '**venceu** a batalha!',
        '**ganhou** a batalha!'
    ]
    const frasesPerdedor = [
        '**perdeu** a batalha!',
        '**morreu** em combate!'
    ]

    const fraseVencedor = frasesVencedor[Math.floor(Math.random() * frasesVencedor.length)]
    const frasePerdedor = frasesPerdedor[Math.floor(Math.random() * frasesPerdedor.length)]

    return (`${vencedor}\n ${fraseVencedor}\n` +
            `${perdedor}\n ${frasePerdedor}\n`)
}
