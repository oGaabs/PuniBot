

// This module needs major rework, refactoring and urgent optimizations
// Working but not finished
// TODO: Refator modulo e adicionar documentação

const axios = require('axios')

async function freeGamesReddit(client) {
    //if (client != '.') return

    const CHANNEL_FREEGAMES = client.channels.cache.get('926556773194801153')
    const INTERVALO_1MIN = 60000
    const MAX_SEARCH_POST = 50
    const jogosRegistrados = []

    // A cada 1 minuto verifica por novos jogos nas devidas plataformas
    setInterval(async () => {
        const posts = await getRedditPostGames()
        if (!posts)
            return

        await sendGamesInfoToChannel(posts.data.children)

        reduceGamesList()
    }, INTERVALO_1MIN)

    async function getRedditPostGames() {
        let postsGames = []

        postsGames = await axios.get('https://reddit.com/r/gamedeals/new.json?sort=new&t=week&limit=100')
            .then(res => {
                if (!res.data.data)
                    return null
                if (!res.data.data.children || res.data.data.children <= 0)
                    return null

                return res.data
            })
            .catch(err => console.error(err))

        return postsGames
    }

    function reduceGamesList() {
        if (jogosRegistrados.length < 100)
            return

        jogosRegistrados.splice(0, jogosRegistrados.length / 4)
    }

    function isValidGamePost(post) {
        const title = post.data.title.toLowerCase()

        const isFreeGame = title.includes('free') || title.includes('100%')
        const isValidPlatform = title.includes('[steam]') || title.includes('[epic games]')
        const isAdultGame = title.includes('nsfw') || title.includes('18')

        if (!isFreeGame || !isValidPlatform || isAdultGame)
            return false

        return true
    }

    function isSecurePost(post) {
        const isSecure = post.data.ups > 10 && post.data.thumbnail !== 'spoiler'
        return isSecure
    }

    async function isGameAlreadySended(redditLink, title, gameUrl) {
        const messages = await CHANNEL_FREEGAMES.messages.fetch({ limit: 99 })

        let messageHasGame = false

        for (const message of messages) {
            if (message.content === `Reddit link:\n${redditLink}`)
                messageHasGame = true
            if (message.content === `**${title}**\n${gameUrl}`)
                messageHasGame = true
        }

        jogosRegistrados.push(redditLink)

        return messageHasGame
    }

    async function sendGameToChannel(title, redditLink, gameUrl) {
        await CHANNEL_FREEGAMES.send('----------------------------{ **FREE GAME** }----------------------------')

        const gameMsg = await CHANNEL_FREEGAMES.send(`**${title}**\n${gameUrl}`)
        const redditMsg = await CHANNEL_FREEGAMES.send('Reddit link:\n' + redditLink)
        if (await gameMsg.embeds)
            redditMsg.suppressEmbeds(true)
    }

    async function sendGamesInfoToChannel(posts) {
        posts = posts.filter((post) => isValidGamePost(post) && isSecurePost(post))
        posts = posts.slice(0, MAX_SEARCH_POST)

        for (const post of posts) {
            const postIndex = post.data
            const gameUrl = postIndex.url
            let postTitle = reduceStrToLimit(postIndex.title, 256)

            const redditLink = `https://reddit.com/${shortifyRedditLink(postIndex.permalink)}`
            if (jogosRegistrados.includes(redditLink))
                continue
            if (await isGameAlreadySended(redditLink, postTitle, gameUrl))
                continue

            sendGameToChannel(postTitle, redditLink, gameUrl)
        }

        //deleteMessages()
    }
    /*
    async function deleteMessages() {
        let messages = await CHANNEL_FREEGAMES.messages.fetch()

        messages = messages.map((message) => {
            if (message.author.id !== client.user.id)
                return

            return { id: message.id, content: message.content.replace('Reddit link:\n', '') }
        })

        for (const redditLink of jogosRegistrados) {
            const index = messages.findIndex((message) => message?.content === `Reddit link:\n${redditLink}`)
            if (index !== -1)
                continue

            messages.splice(index, 3)
        }

        while (messages.length > 0) {
            const message = messages.shift()
            if (!message)
                continue

            const fetchedMessage = await CHANNEL_FREEGAMES.messages.fetch(message.id).catch(() => null)
            if (!fetchedMessage)
                continue
            if (jogosRegistrados.includes(fetchedMessage.content))
                continue

            await fetchedMessage.delete()
        }
    }*/

    function shortifyRedditLink(link) {
        return link.replace('/r/GameDeals/comments/', '').split('/')[0]
    }

    function reduceStrToLimit(str, limit) {
        return str.length < limit ? str : str.substring(0, limit - 1)
    }
}

module.exports = freeGamesReddit