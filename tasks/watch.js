'use strict'

const Co = require('co')

const Log = require('../server/library/log')
const Path = require('../server/library/path')
const { ShellEcho, ShellQuiet, ShellSilent } = require('./library/shell')

const RESOURCES_PATH = Path.join(__dirname, 'resources')

namespace('watch', () => {

  desc('Start watch tasks')
  task('start', ['bundle:create', 'server:restart'], {'async': true}, Co.wrap(function* () {

    Log.debug('> watch:start')

    yield ShellQuiet('jake bundle:watch &')
    yield ShellQuiet('jake server:watch &')

    Log.debug('< watch:start')

  }))

  desc('Stop watch tasks')
  task('stop', {'async': true}, Co.wrap(function* () {

    Log.debug('> watch:stop')

    yield ShellSilent('pkill -f "bundle-watch.json"')
    yield ShellSilent('pkill -f "server-watch.json"')

    Log.debug('< watch:stop')

  }))

  desc('Restart the watch tasks')
  task('restart', {'async': true}, Co.wrap(function* () {

    Log.debug('> watch:restart')

    yield ShellQuiet('jake watch:stop')
    yield ShellQuiet('jake watch:start')

    Log.debug('< watch:restart')

  }))

  desc('Watch for changes requiring restart of the watch tasks')
  task('watch', ['watch:start'], {'async': true}, () => {
    return ShellQuiet(`nodemon --config "${Path.join(RESOURCES_PATH, 'watch-watch.json')}" --on-change-only`)
  })

})
