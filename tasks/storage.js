'use strict'

require('datejs')

const Co = require('co')

const Log = require('../server/library/log')
const Path = require('../server/library/path')
const { ShellEcho, ShellQuiet, ShellSilent } = require('./library/shell')

const LOGS_PATH = Path.join(__dirname, '..', 'process', 'logs')
const PIDS_PATH = Path.join(__dirname, '..', 'process', 'pids')
const RESOURCES_PATH = Path.join(__dirname, 'resources')

namespace('storage', () => {

  desc('Start the storage server')
  task('start', {'async': true}, () => {
    return ShellQuiet(`redis-server "${Path.join(__dirname, '..', 'redis.config')}"`)
  })

  desc('Trim the storage server log (via SIGHUP)')
  task('trim', {'async': true}, Co.wrap(function* () {

    yield ShellSilent(`mv "${Path.join(LOGS_PATH, 'redis.log')}" "${Path.join(LOGS_PATH, `redis.${(new Date()).toString('yyyyMMddhhmmss')}.log`)}"`)
    yield ShellQuiet(`find "${LOGS_PATH}" -name redis.*.log -type f -mmin +15 -delete`)
    yield ShellSilent(`kill -s HUP $(cat "${Path.join(PIDS_PATH, 'redis.pid')}")`)

  }))

  desc('Stop the storage server')
  task('stop', {'async': true}, () => {
    return ShellSilent(`kill $(cat "${Path.join(__dirname, '..', 'process', 'pids', 'redis.pid')}")`)
  })

  desc('Restart the storage server using defaults')
  task('restart', {'async': true}, Co.wrap(function* () {

    Log.debug('> storage:restart')

    yield ShellQuiet('jake storage:trim')
    yield ShellQuiet('jake storage:stop')
    yield ShellQuiet('jake storage:start')

    Log.debug('< storage:restart')

  }))

})
