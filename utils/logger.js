const log = require('ansi-colors')
const moment = require('moment')
moment.locale('pt-br')


module.exports = {
    getDate: () => {
        return moment().format('DD/MM, HH:mm:ss')
    },
    debug: function (title, content, isConsecutive = false) {
        const date = this.getDate()
        title = log.green(title)

        const toLog = isConsecutive ? title : `[${date}]\n${title}`
        console.log(toLog, content)
    },
    error: function (title, content, isConsecutive = false) {
        const date = this.getDate()
        title = log.redBright(title)
        content = log.red(content)

        const toLog = isConsecutive ? title : `[${date}]\n${title}`
        console.log(toLog, content)
    },
    warn: function (title, content, isConsecutive = false) {
        const date = this.getDate()
        title = log.bold.yellow(title)
        content = log.yellow(content)

        const toLog = isConsecutive ? title : `[${date}]\n${title}`
        console.log(toLog, content)
    }
}
