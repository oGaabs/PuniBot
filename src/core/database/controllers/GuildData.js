const Guild = require('../models/Guild')

class GuildData {
    async find(guildId) {
        return Guild.findOne({ guildId })
    }

    async delete(guildId) {
        return Guild.deleteOne({ guildId })
    }

    async update(guildId, data) {
        return Guild.updateOne({ guildId }, data)
    }

    async where(criteria) {
        return Guild.find(criteria)
    }

    async insertOne(data) {
        return Guild.create(data)
    }

    async backupGuilds() {
        await Guild.createCollection('guilds').catch(err => console.error(err))
    }
}

module.exports = GuildData
