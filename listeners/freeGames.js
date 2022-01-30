const nodeFetch = require('node-fetch')

module.exports = async function freeGamesReddit(client) {
    const freeGameChannel = client.canais.get('937164018282557470')
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

    const checkPost = (postTitle) =>{
        postTitle = postTitle.toLowerCase()
        if (!(postTitle.includes('free') || postTitle.includes('100%')))
            return false
        if (!(postTitle.includes('[steam]')|| postTitle.includes('[epic games]')))
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
            if (!checkPost(postTitle)) continue
            if (postIndex.ups <= 10 || postIndex.thumbnail === 'spoiler') continue

            const reddit = 'https://reddit.com/'+`${postIndex.permalink}`.replace('/r/GameDeals/comments/','').split('/')[0]
            if (sentGames.indexOf(reddit) > -1) continue
            const title = postTitle.length < 257 ? postTitle: postTitle.substring(0, 256)
            const freeGameUrl = postIndex.url
            const messages = await freeGameChannel.messages.fetch({limit: 99})
            let find = false
            messages.map((msg) => {
                if ((msg.content === 'Reddit link:\n'+reddit) || msg.content === '**'+title +'**\n'+freeGameUrl)
                    find = true
                return msg
            })
            sentGames.push(reddit)
            if (find) continue
            freeGameChannel.send('----------------------------{ **FREE GAME** }----------------------------')
            const gameMsg = await freeGameChannel.send('**'+title +'**\n'
                                +freeGameUrl)
            const redditMsg = await freeGameChannel.send('Reddit link:\n'+reddit)
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
                    if (message.author.id === client.user.id ) {
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
            sentGames.forEach(reddit =>{
                let index = msgArray.indexOf('Reddit link:\n'+reddit)
                while (index != -1) {
                    msgArray.splice(index,3)
                    idArray.splice(index,3)
                    index = msgArray.indexOf('Reddit link:\n'+reddit)
                }
            })
            idArray = [...new Set(idArray)]
            const deleteOld = async () =>{
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

    module.exports = {sendGames: sendGames}
}

