'use strict'

require('datejs')

const Co = require('co')

const FileSystem = require('../server/library/file-system')
const Log = require('../server/library/log')
const Package = require('../package.json')
const Path = require('../server/library/path')
const Process = require('../server/library/process')
const { ShellEcho, ShellQuiet, ShellSilent } = require('./library/shell')

const LOG_PATH = Path.join(__dirname, '..', 'process', 'logs', `${Package.name}.jake.log`)
const RESOURCES_PATH = Path.join(__dirname, 'resources')

FileSystem.mkdirp.sync(Path.dirname(LOG_PATH))

Log
  .addConsole()
  .addFile(LOG_PATH)

task('default', {'async': true}, () => {
  return ShellQuiet('jake --tasks')
})

desc(`Hard-link ${Path.trim(Path.dirname(LOG_PATH))} to ${Process.env.HOME}/Library/Logs/${Package.name}`)
task('link', {'async': true}, () => {
  return ShellQuiet(`hln "${Path.dirname(LOG_PATH)}" "${Process.env.HOME}/Library/Logs/${Package.name}"`)
})

desc(`Hard-unlink ${Path.trim(Path.dirname(LOG_PATH))} to ${Process.env.HOME}/Library/Logs/${Package.name}`)
task('unlink', {'async': true}, () => {
  return ShellQuiet(`hln -u "${Process.env.HOME}/Library/Logs/${Package.name}"`)
})

namespace('test', () => {

  desc('Test and generate coverage for the server')
  task('server', {'async': true}, () => {
    return ShellQuiet(`istanbul cover "${Path.join(__dirname, '..', 'node_modules', '.bin', '_mocha')}" --dir "${Path.join(__dirname, '..', 'www', 'coverage')}" -- --bail --timeout 0 "${Path.join(__dirname, '..', 'server', 'tests')}"`)
  })

  // desc('Test /www')
  // task('www', {'async': true}, () => {
  //   // return ShellSilent(`mocha-phantomjs --bail --hooks "${Path.trim(Path.join(RESOURCES_PATH, 'hooks.js'))}" --ignore-resource-errors http://localhost:8080/www/index.html?page=./test-page.js`)
  //   return ShellSilent('lsp')
  // })

})

require('./bundle')
require('./server')
require('./storage')
require('./watch')
