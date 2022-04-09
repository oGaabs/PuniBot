const { Client, Collection } = require('discord.js')
const { colors, logger } = require('./utils')
const Fs = require('fs')


module.exports = class PuniBot extends Client {
    constructor(options = {}) {
        super(options)

        this.commands = new Collection()
        this.prefix = process.env.PREFIX.toLowerCase()
        this.colors = colors
        this.logger = logger
    }

    loginBot(token) {
        this.login(token)
            .then(() => this.logger.warn('[DEBUG] ::', `Logado como ${this.user.tag}.\n`))
            .catch(err => this.logger.error('[FAIL] ::', 'Falha ao iniciar o bot : ' + err))
    }

    restartBot() {
        this.destroy()
        this.loginBot(process.env.TOKEN)
    }

    getFooter(guild) {
        return guild ? { text: guild.name, iconURL: guild.iconURL({ dynamic: true, size: 1024 }) } : null
    }

    initCommands(path) {
        const files =  Fs.readdirSync(path)
        const filesLength = files.length
        Fs.readdirSync(path).forEach( (file, index) => {
            try {
                const filePath = path + '/' + file
                if (file.endsWith('.js')) {
                    try {
                        const command = require(filePath)
                        const commandName = file.replace(/.js/g, '').toLowerCase()
                        this.logger.debug('[DEBUG] ::',
                            ` (${++index}/${filesLength}) Loaded ${file} command.`, true)
                        return this.commands.set(commandName, command)
                    }
                    catch (err) {
                        return this.logger.error('[FAIL] ::',
                            `(${++index}) Fail when loading ${file} command.`, err)
                    }
                }
                if (Fs.lstatSync(filePath).isDirectory()){
                    console.log(`\n[${this.logger.getDate()}] Directory: ${file}`)
                    this.initCommands(filePath)
                }
            }
            catch (err) {
                console.error(err)
            }
        })
    }

    initListeners(path) {
        const files =  Fs.readdirSync(path)
        const filesLength = files.length
        console.log(`\n[${this.logger.getDate()}] Directory: ${path.split('/').pop()}`)
        files.forEach((file, index)  => {
            try {
                const filePath = path + '/' + file
                if (file.endsWith('.js')) {
                    const Listener = require(filePath)
                    Listener(this)
                    return this.logger.debug('[DEBUG] ::',
                        ` (${++index}/${filesLength}) Loaded ${file} event.`, true)
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