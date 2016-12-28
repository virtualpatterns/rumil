'use strict'

const Is = require('@pwn/is')
const Pad = require('pad')
const Utilities = require('util')
const Winston = require('winston')

let Log = Object.create(Winston)

Log.format = function(...parameters) {

  const Process = require('./process')

  let options = null

  switch (parameters.length) {
    case 0:
      options = {
        'level': 'debug',
        'message': ''
      }
      break
    case 1:
      options = Is.string(parameters[0]) ? {
        'level': 'debug',
        'message': parameters[0]
      } : parameters[0]
      break
    default:
      options = {
        'level': parameters.shift(),
        'message': Utilities.format.apply(Utilities.format, parameters),
      }
  }

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

Log.inspect = function(...parameters) {

  let level = null
  let object = null

  switch (parameters.length) {
    case 0:
      level = 'debug'
      object = null
      break
    case 1:
      level = 'debug'
      object = parameters[0]
      break
    default:
      level = parameters[0]
      object = parameters[1]
  }

  this.log(level, '- Log.inspect(object) { ... }\n\n%s\n', Utilities.inspect(object))

  return this

}

Log.line = function(level = 'debug') {
  this.log(level, '-'.repeat(80))
  return this
}

Log.removeConsole()

module.exports = Log
