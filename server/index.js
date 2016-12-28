'use strict'

const Co = require('co')
const Command = require('commander')
const Daemon = require('daemon')

const Application = require('./library/application')
const Configuration = require('./library/configuration')
const FileSystem = require('./library/file-system')
const Log = require('./library/log')
const Package = require('../package.json')
const Path = require('./library/path')
const Process = require('./library/process')

// const ADDRESS = '0.0.0.0'
// const PORT = 8081
// const STATIC_PATH = Path.join(Process.cwd(), 'www')
// const MODULES_PATH = Path.join(Process.cwd(), 'node_modules')
// const LOG_PATH = Path.join(Process.LOG_PATH, `${Package.name}.log`)
// const PID_PATH = Path.join(Process.PID_PATH, `${Package.name}.pid`)

// const STORAGE_URI = 'redis://localhost:6379/0'

Command
  .version(Package.version)

Command
  .command('start')
  .description('Start the server')
  // .option('--configuration <configuration>', 'Server process configuration')
  .option('--configurationPath <path>', 'Server process configuration file path')
  .option('--fork', 'Fork the server process, by default the server process is not forked, overrides configuration')
  // .option('--address <address>', `Listening IPv4 or IPv6 address, defaults to ${ADDRESS}`)
  // .option('--port <number>', `Listening port, defaults to ${PORT}`)
  // .option('--staticPath <path>', `Static file path, defaults to ${Path.trim(STATIC_PATH)}`)
  // .option('--modulesPath <path>', `Modules path, defaults to ${Path.trim(MODULES_PATH)}`)
  // .option('--logPath <path>', `Server process log file path, defaults to ${Path.trim(LOG_PATH)}`)
  // .option('--pidPath <path>', `Server process PID file path, defaults to ${Path.trim(PID_PATH)}`)
  // .option('--storageUri <uri>', `Storage server uri, format [redis:]//[[user][:password@]][host][:port][/db], defaults to ${STORAGE_URI}`)
  .action(Co.wrap(function* (options) {

    try {

      // if (options.configuration)
      //   Configuration.assignPath(options.configuration)

      if (options.configurationPath)
        Configuration.assignPath(options.configurationPath)

      yield FileSystem.Promise.mkdirp(Path.dirname(Configuration.logPath))
      yield FileSystem.Promise.mkdirp(Path.dirname(Configuration.pidPath))

      if (options.fork)
        Configuration.fork = options.fork

      if (Configuration.fork)
        Daemon()
      else
        Log.addConsole()

      Log
        .addFile(Configuration.logPath)
        .line()
        .inspect(Configuration)

      Process.on('SIGHUP', () => {
        Log.debug('> Process.once(\'SIGHUP\', () => { ... })')
        Log.removeFile(Configuration.logPath)
        Log.addFile(Configuration.logPath)
        Log.debug('< Process.once(\'SIGHUP\', () => { ... })')
      })

      Application.start(  Configuration.address,
                          Configuration.port,
                          Configuration.staticPath,
                          Configuration.modulesPath,
                          Configuration.pidPath )

    }
    catch(error) {

      Log.error('- %s\n\n%s\n', error.message, error.stack)

      console.log('An error occured starting the server process.\n')
      console.log(error.stack)

      Process.exit(1)

    }

  }))

Command
  .command('stop')
  .description('Stop the server.')
  // .option('--configuration <configuration>', 'Server process configuration')
  .option('--configurationPath <path>', 'Server process configuration file path')
  // .option('--logPath <path>', `Server process log file path, defaults to ${Path.trim(LOG_PATH)}`)
  // .option('--pidPath <path>', `Server process PID file path, defaults to ${Path.trim(PID_PATH)}`)
  .action(Co.wrap(function* (options) {

    try {

      if (options.configurationPath)
        Configuration.assignPath(options.configurationPath)

      yield FileSystem.Promise.mkdirp(Path.dirname(Configuration.logPath))
      yield FileSystem.Promise.mkdirp(Path.dirname(Configuration.pidPath))

      Log
        .addFile(Configuration.logPath)
        .line()
        .inspect(Configuration)

      Application.stop(Configuration.pidPath)

      yield FileSystem.whenFileNotExists(250, 10000, Configuration.pidPath)

    }
    catch(error) {

      Log.error('- %s\n\n%s\n', error.message, error.stack)

      console.log('An error occured stopping the server process.\n')
      console.log(error.stack)

      Process.exit(1)

    }

  }))

Command.parse(process.argv)
