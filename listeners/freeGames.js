const {MessageEmbed} = require('discord.js')

module.exports = async function memberCount(client) {
    const nodeFetch = require('node-fetch')
    const canais = client.canais
    const freeGameChannel = canais.get('926542213012389959')
    const sentGames = []

    client.on('messageCreate', function (msg) {
        // Send free games when users types sendFreeGames, won't send duplicates
        if (msg.content.toLowerCase() === 'fgsend') {
            sendGames(msg.channel.id)
        }
    })

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
            if (postTitle.includes('free') ||
                postTitle.includes('100%') &&
                !postTitle.includes('nsfw')) {
                if (postIndex.data.thumbnail !== 'spoiler') { // posts and not expired  with > 200 scores post[i].data.ups > 200 &&
                    let title = postIndex.data.title
                    if (title.length > 256)
                        title = title.substring(0, 256)
                    if (clientChannel.messages.includes(title))
                        continue
                    const shortReddit = 'https://reddit.com/'+`https://www.reddit.com${postIndex.data.permalink}`.replace('https://www.reddit.com/r/GameDeals/comments/','').split('/')[0]
                    const message =  await clientChannel.send('**'+title +'**'+ '\n'+
                                            postIndex.data.url+ '\n')
                    message.suppressEmbeds(true)
                    clientChannel.send(`Reddit link:\n`+ shortReddit)

                    const author = {
                        name: " |  🎮 Free Game   ",
                        url: `${postIndex.data.url}`,
                        iconURL: 'https://www.citypng.com/public/uploads/preview/hd-purple-glowing-circle-png-31629673575bqjepy1wll.png'
                    }
                    const embedMsg = new MessageEmbed()
                        .setColor('#9B59B6')
                        .setTitle(title)
                        .setURL(`https://www.reddit.com${postIndex.data.permalink}`)
                        .setDescription(`Free game here: ${postIndex.data.url}`)
                        .setAuthor(author)
                        .setTimestamp()
                        .setFooter(client.footer)
                    if (sentGames.indexOf(`${postIndex.data.permalink}${clientChannel}`) === -1) {
                        sentGames.push(`${postIndex.data.permalink}${clientChannel}`)
                        clientChannel.send({embeds: [embedMsg]}).catch()
                    }
                    clientChannel.send('===============================================================================')
                }
            }
        }
    }
}