'use strict'

const Log = require('./log')
const Path = require('./path')
const Process = require('./process')
const Server = require('./server')

class Application {

  constructor() {
  }

  static start(address, port, staticPath, modulesPath, pidPath) {

    // Log.debug('> Application.start(%j, %d, %j, %j, %j) { ... }', address, port, Path.trim(staticPath), Path.trim(modulesPath), Path.trim(pidPath))

    Process
      .createPID(pidPath)
      .once('SIGINT', () => {
        Log.debug('- Process.once(\'SIGINT\', () => { ... })')
        Process.exit(1)
      })
      .once('SIGTERM', () => {
        Log.debug('- Process.once(\'SIGTERM\', () => { ... })')
        Process.exit(1)
      })
      .once('uncaughtException', function(error) {
        Log.error('- Process.once(\'uncaughtException\', function(error) { ... })\n\n%s\n', error.stack)
        Process.exit(2)
      })

    Server
      .createServer(staticPath, modulesPath)
      .listen(port, address)

    Log.debug('< Application.start(%j, %d, %j, %j, %j) { ... }', address, port, Path.trim(staticPath), Path.trim(modulesPath), Path.trim(pidPath))

  }

  static stop(pidPath) {

    Log.debug('> Application.stop(%j) { ... }', Path.trim(pidPath))

    if (Process.existsPID(pidPath))
      Process.killPID(pidPath)

    Log.debug('< Application.stop(%j) { ... }', Path.trim(pidPath))

  }

}

module.exports = Application
