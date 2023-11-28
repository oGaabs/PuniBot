const INTERVALO_1MIN = 60000 //60000

const { EmbedBuilder } = require('discord.js')
const Guild = require('../core/database/models/guild')
const FreeGame = require('../core/database/models/freeGame')
const colors = require('../utils/colors')

async function freeGamesDelivery(client) {
    setInterval(initializeJob, INTERVALO_1MIN)

    function initializeJob() {
        deliveryFreeGamesToGuilds()
    }

    async function deliveryFreeGamesToGuilds() {
        try {
            const [freeGames, guilds] = await Promise.all([getFreeGames(), getGuildsToSend()])
            if (!freeGames || !guilds) return

            for (const guild of guilds) {
                await sendGamesToGuild(guild, freeGames)
            }
        }
        catch (err) {
            console.error('Error on deliveryFreeGamesToGuilds: ', err)
        }
    }

    async function sendGamesToGuild(guild, freeGames) {
        const channel = client.channels.cache.get(guild.freeGamesChannelId)
        if (!channel) return

        for (const game of freeGames) {
            if (guild.registeredFreeGames.includes(game.redditLink)) continue

            await sendGameToChannel(game.title, game.permalink, game.url, channel)
        }

        await updateGamesStatus(freeGames, true)
    }

    async function sendGameToChannel(_title, _redditLink, gameUrl, channel) {
        const imageEmbed = new EmbedBuilder()
            .setImage('https://cdn.discordapp.com/attachments/988122077980655636/1178409352688849027/controller_thumbnail-1.jpeg?ex=65760a3b&is=6563953b&hm=ad82a0b4f8501a7eed416c5be7d49bbedae8e89aceb0d0f85fde629372246260&')

        const gameEmbed = new EmbedBuilder()
            .setTitle('🎮 Jogo Grátis! 🌟')
            .setDescription('Aproveite esta oferta especial! Não perca essa chance única de obter um jogo incrível gratuitamente.')
            .setColor(colors.noColor)

        const footerEmbed = new EmbedBuilder()
            .setImage('https://cdn.discordapp.com/attachments/988122077980655636/1178419331168743515/controller_thumbnail-2.jpg?ex=65761386&is=65639e86&hm=cb0dc20cded57203a508c6c7814683ac62cb131aa41c7d485995c63d021d7f70&')

        await channel.send({ embeds: [imageEmbed, gameEmbed] })
        await channel.send(gameUrl)
        await channel.send({ embeds: [footerEmbed] })
    }

    async function updateGamesStatus(games, hasSended) {
        for (const game of games) {
            game.hasSended = hasSended
            await game.save()
        }
    }

    async function getFreeGames() {
        return await FreeGame.find({ hasSended: false })
    }

    async function getGuildsToSend() {
        return await Guild.find({ freeGamesChannelId: { $exists: true } })
    }

}

module.exports = freeGamesDelivery