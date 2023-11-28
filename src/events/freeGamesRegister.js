
const INTERVALO_1MIN = 60000
const MAX_FREE_GAMES_BATCH = 50

const axios = require('axios')
const FreeGame = require('../core/database/models/freeGame')

const gameValidationConfig = {
    isFreeGame: ['free', '100%'],
    validPlatforms: ['[steam]', '[epic games]'],
    invalidKeywords: ['nsfw', '18']
}


async function freeGamesReddit(_client) {
    setInterval(initializeJob, INTERVALO_1MIN)

    function initializeJob() {
        registerFreeGames()
    }

    async function registerFreeGames() {
        const gamesPosts = await getRedditGamePosts()
        if (!gamesPosts) return

        const freeGames = prepareGameData(gamesPosts)
        await updateFreeGamesToDb(freeGames)
    }

    async function getRedditGamePosts() {
        try {
            const response = await axios.get('https://reddit.com/r/gamedeals/new.json?sort=new&t=week&limit=100')
            if (!response.data?.data?.children) return null
            return response.data.data.children
        } catch (error) {
            console.error(error)
            return null
        }
    }

    function prepareGameData(gamesPosts) {
        try {
            const games = []

            for (const post of gamesPosts) {
                if (!isValidGamePost(post) || !isSecurePost(post)) continue

                const game = {
                    title: limitString(post.data.title, 255),
                    url: post.data.url,
                    permalink: `https://reddit.com/${shortenRedditLink(post.data.permalink)}`,
                    domain: post.data.domain,
                    created: post.data.created,
                    created_utc: post.data.created_utc,
                    hasSended: false
                }

                games.push(game)

                if (games.length >= MAX_FREE_GAMES_BATCH) break
            }

            return games
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async function updateFreeGamesToDb(freeGames) {
        try {
            for (const freeGame of freeGames) {
                if (await checkIfGamesHasRegistered(freeGame.permalink)) continue

                const newFreeGame = new FreeGame(freeGame)
                await newFreeGame.save()
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    function isValidGamePost(post) {
        const title = post.data.title.toLowerCase()

        const isFreeGame = gameValidationConfig.isFreeGame.some(keyword => title.includes(keyword))
        const isValidPlatform = gameValidationConfig.validPlatforms.some(platform => title.includes(platform))
        const hasInvalidKeywords = gameValidationConfig.invalidKeywords.some(keyword => title.includes(keyword))

        return isFreeGame && isValidPlatform && !hasInvalidKeywords
    }

    async function checkIfGamesHasRegistered(redditPermalink) {
        const isRegisteredGame = await FreeGame.findOne({ permalink: redditPermalink })

        return isRegisteredGame
    }

    function isSecurePost(post) {
        return post.data.ups > 10 && post.data.thumbnail !== 'spoiler'
    }

    function shortenRedditLink(link) {
        return link.replace('/r/GameDeals/comments/', '').split('/')[0]
    }

    function limitString(str, limit) {
        return str.length < limit ? str : str.substring(0, limit - 1)
    }
}

module.exports = freeGamesReddit