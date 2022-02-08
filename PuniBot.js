const { Client, Collection } = require('discord.js')
const { colors } = require('./utils')
const Fs = require('fs')


module.exports = class PuniBot extends Client {
    constructor(options = {}) {
        super(options)

        this.commands = new Collection()
        this.prefix = process.env.PREFIX.toLowerCase()
    }

    getColor(color) {
        const colorsJSON = JSON.parse(JSON.stringify(colors))
        return colorsJSON.hasOwnProperty(color) ? colorsJSON[color] : null
    }

    getFooter(message) {
        return message ? { text: message.guild.name, iconURL: message.guild.iconURL() } : null
    }

    initCommands(path) {
        Fs.readdirSync(path).forEach(file => {
            try {
                const filePath = path + '/' + file
                if (file.endsWith('.js')) {
                    const command = require(filePath)
                    const commandName = file.replace(/.js/g, '').toLowerCase()
                    return this.commands.set(commandName, command)
                }
                if (Fs.lstatSync(filePath).isDirectory())
                    this.initCommands(filePath)
            }
            catch (err) {
                console.error(err)
            }
        })
    }

    initListeners(path) {
        Fs.readdirSync(path).forEach(file => {
            try {
                const filePath = path + '/' + file
                if (file.endsWith('.js')) {
                    const Listener = require(filePath)
                    return Listener(this)
                }
                if (Fs.lstatSync(filePath).isDirectory())
                    this.initListeners(filePath)
            }
            catch (err) {
                console.error(err)
            }
        })
    }
}