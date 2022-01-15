module.exports = async function freeGamesReddit(client) {
    const nodeFetch = require('node-fetch')
    const canais = client.canais
    const freeGameChannel = canais.get('926542213012389959')
    const sentGames = []

    // Call fetchGames every 1 hour (3600000 milliseconds)
    setInterval(function () {
        sendGames()

        if (sentGames.length > 100000)
            sentGames.splice(0, sentGames.length - 25000) // remove quarter of sent games list
    }, 60000)

    const sendGames = async ()=>{
        const posts = await fetchPosts()
        if (posts !== 'invalid' && posts !== null)
            getCurrentGames(posts)
    }

    // Fetch posts from Reddit using node-fetch and return the body
    const fetchPosts = async () => {
        try{
            const res = await nodeFetch('https://reddit.com/r/gamedeals/new.json?sort=new&t=week&limit=100')
            const body = await res.json()
            if (!body.data)
                return null
            if (!body.data.children || body.data.children <= 0)
                return 'invalid'
            return body
        }
        catch (err){
            console.log(err)
        }
    }

    const checkPost = (postIndex) =>{
        const postTitle = postIndex.title.toLowerCase()
        if (!(postTitle.includes('free') || postTitle.includes('100%')))
            return false
        if (!(postTitle.includes('steam')|| postTitle.includes('epic games')))
            return false
        if (postTitle.includes('nsfw') || postTitle.includes('18'))
            return false

        return true
    }

    const getCurrentGames = async (post) => {
        const clientChannel = freeGameChannel
        post = post.data.children
        for (let i = 0; i < 50; i++) {
            const postIndex = post[i].data
            const postTitle = postIndex.title
            if (checkPost(postIndex)){
                if (postIndex.ups > 10 && postIndex.thumbnail !== 'spoiler') {
                    const reddit = 'https://reddit.com/'+`${postIndex.permalink}`.replace('/r/GameDeals/comments/','').split('/')[0]
                    if (sentGames.indexOf(reddit) > -1) continue
                    const title = postTitle.length < 257 ? postTitle: postTitle.substring(0, 256)
                    const freeGameUrl = postIndex.url
                    const messages = await clientChannel.messages.fetch({limit: 99})
                    let find = false
                    messages.map((msg) => {
                        if ((msg.content === 'Reddit link:\n'+reddit) || msg.content === '**'+title +'**\n'+freeGameUrl)
                            find = true
                        return msg
                    })
                    sentGames.push(reddit)
                    if (find) continue
                    clientChannel.send('----------------------------{ **FREE GAME** }----------------------------')
                    const gameMsg = await clientChannel.send('**'+title +'**\n'
                                        +freeGameUrl)
                    const redditMsg = await clientChannel.send('Reddit link:\n'+reddit)
                    if (await gameMsg.embeds)
                        redditMsg.suppressEmbeds(true)
                }
            }
        }
    }

    module.exports = {sendGames: sendGames}
}

