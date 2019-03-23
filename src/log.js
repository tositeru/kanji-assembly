const log4js = require('log4js')

const logFilepath =
  process.env.NODE_ENV === 'test' ? 'server-test.log' : 'server.log'

log4js.configure({
  appenders: {
    everything: { type: 'file', filename: logFilepath }
  },
  categories: {
    default: { appenders: ['everything'], level: 'debug' }
  }
})

class Logger {
  /**
   *
   * @param {string} name
   * @param {string} level
   */
  constructor(name, level = 'debug') {
    this.logger = log4js.getLogger(name)
    this.logger.level = level
  }

  /**
   *
   * @param {string} tag
   * @param {string} paramText
   * @param {string} message
   */
  info(tag, paramText, message = '') {
    this.logger.info(`${tag}! ${paramText} : ${message}`)
  }

  /**
   *
   * @param {string} tag
   * @param {string} paramText
   * @param {string} message
   */
  error(tag, paramText, message = '') {
    this.logger.error(`${tag}... ${paramText} : ${message}`)
  }
}

module.exports = Logger
