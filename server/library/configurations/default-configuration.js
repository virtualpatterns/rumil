'use strict'

const Package = require('../../../package.json')
const Path = require('../path')
const Process = require('../process')

module.exports = function(Configuration) {
  return {
    'fork': false,
    'address': '0.0.0.0',
    'port': 8081,
    'staticPath': Path.join(__dirname, '..', '..', '..', 'www'),
    'modulesPath': Path.join(__dirname, '..', '..', '..', 'node_modules'),
    'logPath': Path.join(__dirname, '..', '..', '..', 'process', 'logs', `${Package.name}.log`),
    'pidPath': Path.join(__dirname, '..', '..', '..', 'process', 'pids', `${Package.name}.pid`)
  }
}
