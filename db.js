const mongoose = require('mongoose')
mongoose.connect(process.env.MONG)

const produtoSchema = new mongoose.Schema(
    { nome: String, preco: Number },
    { collection: 'produto' }
)

//const ObjectId = require('mongodb').ObjectId

module.exports = { Mongoose: mongoose, ProdutoSchema: produtoSchema }