module.exports = function errorHandler(client) {
    process.on('unhandledRejection', error => {
        client.logger.warn('[Anti-Crash] ::', 'Unhandled Rejection')
        client.logger.error('[Error] => ', error.stack + '\n', true)

        client.logger.debug('[DEBUG] ::', 'Logando novamente...')
        client.restartBot()
    })
}
