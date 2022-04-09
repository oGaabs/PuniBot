const nodeFetch = require('node-fetch')
// This module needs major rework, refactoring and urgent optimizations
// Working but not finished
//

module.exports = async function freeGamesReddit(client) {
    const freeGameChannel = client.channels.cache.get('937164018282557470')
    const sentGames = []

    // A cada 1 minuto verifica por novos jogos nas devidas plataformas
    setInterval(function () {
        fetchFreeGames()

        if (sentGames.length > 100000)
            sentGames.splice(0, sentGames.length - 25000) // remove quarter of sent games list
    }, 60000)

    const fetchFreeGames = async () => {
        const posts = await fetchPosts()

        if (posts !== 'invalid' && posts !== null)
            getCurrentGames(posts)
    }

    // Fetch posts from Reddit using node-fetch and return the body
    const fetchPosts = async () => {
        try {
            let body
            try{
                body = await nodeFetch('https://reddit.com/r/gamedeals/new.json?sort=new&t=week&limit=100').catch()
                    .then(res => res.json())
            }
            catch (err) { return null }

            if (!body.data)
                return null
            if (!body.data.children || body.data.children <= 0)
                return 'invalid'
            return body
        }
        catch (err) { console.log(err) }
    }

    const isValidPost = (postTitle) => {
        postTitle = postTitle.toLowerCase()
        if (!(postTitle.includes('free') || postTitle.includes('100%')))
            return false
        if (!(postTitle.includes('[steam]') || postTitle.includes('[epic games]')))
            return false
        if (postTitle.includes('nsfw') || postTitle.includes('18'))
            return false

        return true
    }

    const getCurrentGames = async (post) => {
        post = post.data.children
        for (let i = 0; i < 50; i++) {
            const postIndex = post[i].data
            const postTitle = postIndex.title
            if (!isValidPost(postTitle)) continue
            if (postIndex.ups <= 10 || postIndex.thumbnail === 'spoiler') continue

            const reddit = 'https://reddit.com/' + `${postIndex.permalink}`.replace('/r/GameDeals/comments/', '').split('/')[0]
            if (sentGames.indexOf(reddit) > -1) continue
            const title = postTitle.length < 257 ? postTitle : postTitle.substring(0, 256)
            const freeGameUrl = postIndex.url
            const messages = await freeGameChannel.messages.fetch({ limit: 99 })
            let find = false
            messages.map((msg) => {
                if ((msg.content === 'Reddit link:\n' + reddit) || msg.content === '**' + title + '**\n' + freeGameUrl)
                    find = true
                return msg
            })
            sentGames.push(reddit)
            if (find) continue
            freeGameChannel.send('----------------------------{ **FREE GAME** }----------------------------')
            const gameMsg = await freeGameChannel.send('**' + title + '**\n'
                + freeGameUrl)
            const redditMsg = await freeGameChannel.send('Reddit link:\n' + reddit)
            if (await gameMsg.embeds)
                redditMsg.suppressEmbeds(true)
        }
        await searchMessages()
    }

    let idArray = []
    let msgArray = []

    const searchMessages = async () => {
        freeGameChannel.messages.fetch().then(messages => {
            try {
                messages.map((message) => {
                    if (message.author.id === client.user.id) {
                        if (idArray.indexOf(message.id) === -1) {
                            idArray.push(message.id)
                            msgArray.push(message.content)
                        }
                    }
                    return message
                })
            }
            catch (error) {
                console.log(error)
            }
            sentGames.forEach(reddit => {
                let index = msgArray.indexOf('Reddit link:\n' + reddit)
                while (index != -1) {
                    msgArray.splice(index, 3)
                    idArray.splice(index, 3)
                    index = msgArray.indexOf('Reddit link:\n' + reddit)
                }
            })
            idArray = [...new Set(idArray)]
            const deleteOld = async () => {
                while (idArray.length != 0) {
                    const id = idArray.shift()
                    if (!id) continue
                    const message = await freeGameChannel.messages.fetch(id)
                    if (!message) continue
                    await message.delete()
                }
            }
            deleteOld()
        })
    }

    module.exports = { sendGames: fetchFreeGames }

    /*
    // fetch steam games with 100% discount
    const getCurrentGames = async (posts) => {
        const steamGames = await fetchSteamGames()
        const epicGames = await fetchEpicGames()
        const games = steamGames.concat(epicGames)

        if (games.length > 0)
            sendGames(posts, games)

        if (steamGames.length > 0)
            console.log(`[${client.logger.getDate()}] Fetched ${steamGames.length} steam games.`)
        if (epicGames.length > 0)
            console.log(`[${client.logger.getDate()}] Fetched ${epicGames.length} epic games.`)
    }

        const steamGamesHTML = await nodeFetch('https://store.steampowered.com/search/?force_infinite=1&maxprice=free&specials=1')
            .then(res => res.text())
        const steamGamesName = steamGamesHTML.match(/<span class="title">(.*?)<\/span>/)
        const steamGamesLink = steamGamesHTML.match(/<a href="https.*"*$/)
        console.log(steamGamesName+steamGamesLink)
        // fetch free games from epic games and get the name and link
        const epicGames = await nodeFetch('https://www.epicgames.com/store/pt-BR/free-games')
        const epicGamesHTML = await epicGames.text()
        const epicGamesName = epicGamesHTML.match(/<h3 class="product-title">(.*?)<\/h3>/)
        const epicGamesLink = epicGamesHTML.match(/<a href="(.*?)"/)
        // fetch free games from steam and get the name and link

        // fetch free games from uplay and get the name and link
        const uplayGames = await nodeFetch('https://www.uplay.com/pt-BR/games/free-games')
        const uplayGamesHTML = await uplayGames.text()
        const uplayGamesName = uplayGamesHTML.match(/<h3 class="product-title">(.*?)<\/h3>/)
        const uplayGamesLink = uplayGamesHTML.match(/<a href="(.*?)"/)
        // fetch free games from origin and get the name and link
        const originGames = await nodeFetch('https://www.origin.com/pt-br/store/free-games')
        const originGamesHTML = await originGames.text()
        const originGamesName = originGamesHTML.match(/<h3 class="product-title">(.*?)<\/h3>/)
        const originGamesLink = originGamesHTML.match(/<a href="(.*?)"/)
    */
}

