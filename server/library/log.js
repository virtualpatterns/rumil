'use strict'

const Utilities = require('util')
const Winston = require('winston')

let Log = Object.create(Winston)

Log.format = function(options) {

  const Pad = require('pad')
  // const Utilities = require('util')

  const Process = require('./process')

  return Utilities.format(  '%s %d %s %s',
                            new Date().toISOString(),
                            Process.pid,
                            Pad(options.level.toUpperCase(), 5),
                            (options.message ? options.message : ''))

}

Log.addConsole = function(level = 'debug') {

  this.add(Winston.transports.Console, {
    'formatter': this.format,
    'level': level,
    'timestamp': true
  })

  return this

}

Log.removeConsole = function() {

  this.remove(Winston.transports.Console)

  return this

}

Log.addFile = function(path, level = 'debug') {

  this.add(Winston.transports.File, {
    'name': path,
    'filename': path,
    'formatter': this.format,
    'json': false,
    'level': level,
    'timestamp': true
  })

  return this

}

Log.removeFile = function(path) {

  this.remove(path)

  return this

}

Log.inspect = function(object) {

  this.debug('- Log.inspect(object) { ... }\n\n%s', Utilities.inspect(object))

  return this

}

Log.line = function(level = 'info') {

  this.log(level, '-'.repeat(80))

  return this

}

Log.removeConsole()

module.exports = Log
