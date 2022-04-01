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
        return Object.prototype.hasOwnProperty.call(colorsJSON, color) ? colorsJSON[color] : null
    }

    getFooter(guild) {
        return guild ? { text: guild.name, iconURL: guild.iconURL({ dynamic: true, size: 1024 }) } : null
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