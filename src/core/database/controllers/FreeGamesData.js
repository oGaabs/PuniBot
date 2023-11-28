const FreeGame = require('../models/freeGame')


class FreeGamesData {

    getFreeGames() {
        return FreeGame.find({})
    }

    isGameAlreadyRegistered(redditLink) {
        return FreeGame.exists({ redditLink })
    }

    find(gameId) {
        return FreeGame.findOne({ gameId })
    }

    async delete(_gameId) {
        return null
    }

    async update(_gameId, _data) {

        return null
    }

    async where(_criteria) {

        return null
    }

    async insertOne(_data) {

        return null
    }
}

module.exports = FreeGamesData
