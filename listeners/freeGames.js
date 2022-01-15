const {MessageEmbed} = require('discord.js')

module.exports = async function freeGamesReddit(client) {
    const nodeFetch = require('node-fetch')
    const canais = client.canais
    const freeGameChannel = canais.get('926542213012389959')
    const sentGames = []

    // Call fetchGames every 1 hour (3600000 milliseconds)
    setInterval(function () {
        sendGames()

        if (sentGames.length > 1000000) {
            sentGames.splice(0, sentGames.length - 250000) // remove quarter of sent games list
        }
    }, 900000)

    const sendGames = async () => {
        const posts = await fetchPosts()
        if (posts !== 'invalid' && posts !== null) {
            getCurrentGames(posts)
        }
    }

    // Fetch posts from Reddit using node-fetch and return the body
    const fetchPosts = async () => {
        const targetURL = 'https://reddit.com/r/gamedeals/new.json?sort=new&t=week&limit=100'

        try {
            const res = await nodeFetch(targetURL)
            const body = await res.json()
            if (!body.data) {
                console.log('No posts found')
                return null
            }
            if (!body.data.children || body.data.children <= 0) {
                console.log('invalid')
                return 'invalid'
            }
            return body
        }
        catch (err) {
            console.log(err)
        }
    }

    const getCurrentGames = async (post) => {
        const clientChannel = freeGameChannel
        post = post.data.children
        for (let i = 0; i < 100; i++) {
            const postIndex = post[i]
            const postTitle = post[i].data.title.toLowerCase()
            if ((postTitle.includes('free') || postTitle.includes('100%')) &&
               !(postTitle.includes('nsfw') || postTitle.includes('18'))  &&
               (postTitle.includes('steam') || postTitle.includes('epic games'))) {
                if (post[i].data.ups > 10 && postIndex.data.thumbnail !== 'spoiler') { // posts and not expired
                    const title = postIndex.data.title.length < 257 ? postIndex.data.title: title.substring(0, 256)
                    const reddit = 'https://reddit.com/'+`${postIndex.data.permalink}`.replace('/r/GameDeals/comments/','').split('/')[0]
                    const freeGameUrl = postIndex.data.url
                    let find = false
                    const messages = await clientChannel.messages.fetch({limit: 99})
                    messages.map((nome) => {
                        if ((nome.content === 'Reddit link:\n'+reddit) || nome.content === '**'+title +'**\n'+freeGameUrl)
                            find = true
                        return nome
                    })
                    if (find) continue
                    if (sentGames.indexOf(reddit) === -1) {
                        sentGames.push(reddit)
                        clientChannel.send('----------------------------{ **FREE GAME** }----------------------------')
                        const gameMsg = await clientChannel.send('**'+title +'**\n'
                                            +freeGameUrl)
                        const redditMsg = await clientChannel.send('Reddit link:\n'+reddit)
                        if (gameMsg.embeds)
                            redditMsg.suppressEmbeds(true)
                    }
                }
            }
        }
    }
    this.sendGames = sendGames()
}
