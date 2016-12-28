'use strict'

require('datejs')

const Co = require('co')

const Log = require('../server/library/log')
const Package = require('../package.json')
const Path = require('../server/library/path')
const { ShellEcho, ShellQuiet, ShellSilent } = require('./library/shell')

const CONFIGURATION_PATH = Path.join(__dirname, '..', 'configurations', 'server', 'development-configuration.js')
const LOGS_PATH = Path.join(__dirname, '..', 'process', 'logs')
const PIDS_PATH = Path.join(__dirname, '..', 'process', 'pids')
const RESOURCES_PATH = Path.join(__dirname, 'resources')
const SERVER_PATH = Path.join(__dirname, '..', 'server', 'index.js')

namespace('server', () => {

  desc('Debug the server')
  task('debug', {'async': true}, () => {
    return ShellQuiet(`node-debug "${SERVER_PATH}" start --configurationPath "${CONFIGURATION_PATH}"`)
  })

  desc('Run the server')
  task('run', {'async': true}, () => {
    return ShellQuiet(`node "${SERVER_PATH}" start --configurationPath "${CONFIGURATION_PATH}"`)
  })

  desc('Start the server and fork')
  task('start', {'async': true}, () => {
    return ShellQuiet(`node "${SERVER_PATH}" start --fork --configurationPath "${CONFIGURATION_PATH}"`)
  })

  desc('Trim the server log (via SIGHUP)')
  task('trim', {'async': true}, Co.wrap(function* () {

    yield ShellSilent(`mv "${Path.join(LOGS_PATH, `${Package.name}.log`)}" "${Path.join(LOGS_PATH, `${Package.name}.${(new Date()).toString('yyyyMMddhhmmss')}.log`)}"`)
    yield ShellQuiet(`find "${LOGS_PATH}" -name ${Package.name}.*.log -type f -mmin +15 -delete`)
    yield ShellSilent(`kill -s HUP $(cat "${Path.join(PIDS_PATH, `${Package.name}.pid`)}")`)

  }))

  desc('Stop the server')
  task('stop', {'async': true}, () => {
    return ShellQuiet(`node "${SERVER_PATH}" stop --configurationPath "${CONFIGURATION_PATH}"`)
  })

  desc('Restart the server')
  task('restart', {'async': true}, Co.wrap(function* () {

    Log.debug('> server:restart')

    yield ShellQuiet('jake server:trim')
    yield ShellQuiet('jake server:stop')
    yield ShellQuiet('jake server:start')

    Log.debug('< server:restart')

  }))

  desc('Watch for changes requiring server restart')
  task('watch', {'async': true}, () => {
    return ShellQuiet(`nodemon --config "${Path.join(RESOURCES_PATH, 'server-watch.json')}" --on-change-only`)
  })

})
