module.exports = {
    name: 'skip',
    aliases: ['pular'],
    description: 'Pular música',
    execute: async (message, _args, _client) => {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) return message.reply('Você precisa entrar em um canal de texto!')

        const { queue } = message.client
        if (!queue) return message.reply('Não ha nenhuma musica sendo tocada!')

        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.reply('Não ha nenhuma musica sendo tocada!')
        serverQueue.player.emit('idle')
    }
}