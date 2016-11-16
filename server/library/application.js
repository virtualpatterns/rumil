'use strict'

const Log = require('./log')
const Path = require('./path')
const Process = require('./process')
const Server = require('./server')

let Application = Object.create({})

Application.start = function (address, port, staticPath, modulesPath, pidPath) {

  Log.info('> Application.start(%j, %d, %j, %j, %j) { ... }', address, port, Path.trim(staticPath), Path.trim(modulesPath), Path.trim(pidPath))

  Process
    .createPID(pidPath)
    .once('SIGINT', () => {
      Log.info('- Process.once(\'SIGINT\', () => { ... })')
      Process.exit(1)
    })
    .once('SIGTERM', () => {
      Log.info('- Process.once(\'SIGTERM\', () => { ... })')
      Process.exit(1)
    })
    .once('uncaughtException', function(error) {
      Log.error('- Process.once(\'uncaughtException\', function(error) { ... })\n\n%s\n', error.stack)
      Process.exit(2)
    })

  Server
    .createServer(staticPath, modulesPath)
    .listen(port, address)

  Log.info('< Application.start(%j, %d, %j, %j) { ... }', address, port, Path.trim(staticPath), Path.trim(pidPath))

}

Application.stop = function (pidPath) {

  Log.info('> Application.stop(%j) { ... }', Path.trim(pidPath))

  if (Process.existsPID(pidPath))
    Process.killPID(pidPath)

  Log.info('< Application.stop(%j) { ... }', Path.trim(pidPath))

}

module.exports = Application
