'use strict'

const Is = require('@pwn/is')
const Pad = require('pad')
const Utilities = require('util')

class Log {

  static log(...parameters) {

    let level = parameters.shift().toUpperCase()
    let levelFn = console.log.bind(console)

    if (window.callPhantom)
      levelFn = this.logPhantom.bind(this)
    else
      switch (level) {
        case 'LOG':
          levelFn = console.log.bind(console)
          break
        case 'ERROR':
          levelFn = console.error.bind(console)
          break
        case 'WARN':
          levelFn = console.warn.bind(console)
          break
        case 'INFO':
          levelFn = console.info.bind(console)
          break
        case 'DEBUG':
          levelFn = console.debug.bind(console)
          break
        default:
          levelFn = console.log.bind(console)
      }

    if (Is.string(parameters[0])) {

      let message = null
      message = Utilities.format.apply(Utilities.format, parameters)

      message = Utilities.format( '%s %s %s',
                                  new Date().toISOString(),
                                  Pad(level, 5),
                                  message || '')

      levelFn(message)

    }
    else if (Is.error(parameters[0])) {

      let error = parameters[0]

      levelFn(Utilities.format('-  error.message=%h', error.message))
      levelFn(Utilities.format('-  error.stack ...\n\n%s\n\n', error.stack))

    }
    else {

      let object = parameters.shift()

      let message = null
      message = Utilities.format( '%s %s ...\n',
                                  new Date().toISOString(),
                                  Pad(level, 5))

      levelFn(message)
      levelFn(object)

    }

    return this

  }

  static logPhantom(message) {

    window.callPhantom({
      'message': message
    })

    return this

  }

  static error(...parameters) {
    parameters.unshift('error')
    return this.log.apply(this, parameters)
  }

  static warn(...parameters) {
    parameters.unshift('warn')
    return this.log.apply(this, parameters)
  }

  static info(...parameters) {
    parameters.unshift('info')
    return this.log.apply(this, parameters)
  }

  static debug(...parameters) {
    parameters.unshift('debug')
    return this.log.apply(this, parameters)
  }

}

module.exports = Log
