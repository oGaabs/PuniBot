module.exports = {
    default: '#9B59B6',
    noColor: '#2f3136',
    alert: '#EFFF00',
    black: '#000000',
    green: '#B3FFB3',
    log: '#2F3136',
    randomColor: () => {
        return Math.floor(Math.random() * 16777215).toString(16)
    }
}
