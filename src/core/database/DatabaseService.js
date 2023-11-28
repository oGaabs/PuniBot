const mongoose = require('mongoose')

class DatabaseService {
    constructor(uri) {
        this.uri = uri
        this.databaseOptions = { }
        this.client = mongoose
    }

    async connect() {
        try {
            await this.client.connect(this.uri, this.databaseOptions)

            console.log('Connected to MongoDB')
            await this.listDatabases(this.client)
        } catch (err) {
            console.error('Error when connecting to MongoDB:', err)
            throw err
        }
    }

    async listDatabases(client) {
        const databasesList = await client.connection.db.admin().listDatabases()

        console.log('Databases:')
        databasesList.databases.forEach(db => console.log(` - ${db.name}`))
    }

    close() {
        this.client.disconnect()
    }
}

module.exports = DatabaseService