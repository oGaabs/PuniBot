const { Events } = require('discord.js')
const Guild = require('../core/database/models/guild')

module.exports = async function initializeGuildCreation(client) {
    initializeInCacheGuilds()

    client.on(Events.GuildCreate, async (guild) => {
        initializeGuild(guild.id)
    })

    async function initializeInCacheGuilds() {
        try {
            const cacheGuilds = client.guilds.cache

            for (const [guildId, guild] of cacheGuilds) {
                if (await isGuildInDatabase(guildId)) {
                    continue
                }

                await saveGuildInDb({ id: guildId, name: guild.name, prefix: client.prefix})
            }
        } catch (err) {
            console.error(err)
        }
    }

    async function initializeGuild(guildId) {
        try {
            const guildDoc = await Guild.findOne({ guildId: guildId })
            if (guildDoc) return

            const guild = await client.guilds.cache.get(guildId)

            await saveGuildInDb({ id: guildId, name: guild.name, prefix: client.prefix})
        } catch (err) {
            console.error(err)
        }
    }

    async function saveGuildInDb(guild) {
        try {
            const guildDoc = new Guild({
                guildId: guild.id,
                guildName: guild.name,
                prefix: guild.prefix,
                welcomeChannelId: guild.welcomeChannelId ?? null,
                goodbyeChannelId: guild.goodbyeChannelId ?? null,
                freeGamesChannelId: guild.freeGamesChannelId ?? null,
                registeredFreeGames: [],
            })

            await guildDoc.save()
        } catch (err) {
            console.error(err)
        }
    }

    async function isGuildInDatabase(guildId) {
        return !!await Guild.findOne({ guildId: guildId })
    }
}
