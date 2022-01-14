const {Client, Collection} = require('discord.js')
const Fs = require('fs')

module.exports = class PuniBot extends Client{
    constructor(options = {}) {
        super(options)

        this.commands = new Collection()
    }

    get guild(){
        return this._guild;
    }
    get canais(){
        return this._canais;
    }
    get footer(){
        return this._footer;
    }
    get prefix(){
        return this._prefix;
    }
    set guild(g){
        this._guild = g;
    }
    set canais(c){
        this._canais = c;
    }
    set footer(f){
        this._footer = f;
    }
    set prefix(p){
        this._prefix = p;
    }

    initCommands(path) {
        Fs.readdirSync(path).forEach(file =>{
            try{
                let filePath = path + '/' + file
                if (file.endsWith('.js')){
                    const command = require(filePath)
                    const commandName = file.replace(/.js/g, '').toLowerCase()
                    return this.commands.set(commandName, command)
                }
                else if (Fs.lstatSync(filePath).isDirectory()){
                    this.initCommands(filePath)
                }
            }
            catch (err){
                console.error(err)
            }
        })
    }

    initListeners(path) {
        const files = Fs.readdirSync(path)
        files.forEach(file => {
            try{
                let filePath = path + '/' + file
                if (file.endsWith('.js')) {
                    let Listener = require(filePath)
                    Listener(this)
                }
                else if (Fs.lstatSync(filePath).isDirectory()) {
                    this.initListeners(filePath)
                }
            }
            catch (err) {
                console.error(err)
            }
        })
    }
}