const express = require('express')

const server = express()
const porta = process.env.PORT || 3000

server.all('/', async (_req, res) => {
    res.send('<h1> Servidor de internet NodeJS funcionando.</h1>')
})

function startHost() {
    server.listen(porta, () => console.log('> Servidor NodeJS funcionando na porta ' + porta + '.'))
}

module.exports = startHost