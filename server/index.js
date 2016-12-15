'use strict'

const Command = require('commander')
const Daemon = require('daemon')

const Application = require('./library/application')
const FileSystem = require('./library/file-system')
const Log = require('./library/log')
const Package = require('../package.json')
const Path = require('./library/path')
const Process = require('./library/process')

const ADDRESS = '0.0.0.0'
const PORT = 8081
const STATIC_PATH = Path.join(Process.cwd(), 'www')
const MODULES_PATH = Path.join(Process.cwd(), 'node_modules')
const LOG_PATH = Path.join(Process.LOG_PATH, `${Package.name}.log`)
const PID_PATH = Path.join(Process.PID_PATH, `${Package.name}.pid`)

const STORAGE_URI = 'redis://localhost:6379/0'

Command
  .version(Package.version)

Command
  .command('start')
  .description('Start the server')
  .option('--fork', 'Fork the server process, by default the server process is not forked')
  .option('--address <address>', `Listening IPv4 or IPv6 address, defaults to ${ADDRESS}`)
  .option('--port <number>', `Listening port, defaults to ${PORT}`)
  .option('--staticPath <path>', `Static file path, defaults to ${Path.trim(STATIC_PATH)}`)
  .option('--modulesPath <path>', `Modules path, defaults to ${Path.trim(MODULES_PATH)}`)
  .option('--logPath <path>', `Server process log file path, defaults to ${Path.trim(LOG_PATH)}`)
  .option('--pidPath <path>', `Server process PID file path, defaults to ${Path.trim(PID_PATH)}`)
  .option('--storageUri <uri>', `Storage server uri, format [redis:]//[[user][:password@]][host][:port][/db], defaults to ${STORAGE_URI}`)
  .action((options) => {

    if (options.fork)
      Daemon()
    else
      Log.addConsole()

    FileSystem.mkdirp.sync(Path.dirname(options.logPath || LOG_PATH))
    FileSystem.mkdirp.sync(Path.dirname(options.pidPath || PID_PATH))

    Log
      .addFile(options.logPath || LOG_PATH)
      .line()

    Process.on('SIGHUP', () => {
      Log.debug('> Process.once(\'SIGHUP\', () => { ... })')
      Log.removeFile(options.logPath || LOG_PATH)
      Log.addFile(options.logPath || LOG_PATH)
      Log.debug('< Process.once(\'SIGHUP\', () => { ... })')
    })

    try {

      Application.start(  options.address || ADDRESS,
                          options.port || PORT,
                          options.staticPath || STATIC_PATH,
                          options.modulesPath || MODULES_PATH,
                          options.pidPath || PID_PATH )

    }
    catch(error) {

      Log.error('- %s\n\n%s\n', error.message, error.stack)

      console.log('An error occured starting the server process.\n')
      console.log(error.stack)

      Process.exit(1)

    }

  })

Command
  .command('stop')
  .description('Stop the server.')
  .option('--logPath <path>', `Server process log file path, defaults to ${Path.trim(LOG_PATH)}`)
  .option('--pidPath <path>', `Server process PID file path, defaults to ${Path.trim(PID_PATH)}`)
  .action((options) => {

    FileSystem.mkdirp.sync(Path.dirname(options.logPath || LOG_PATH))
    FileSystem.mkdirp.sync(Path.dirname(options.pidPath || PID_PATH))

    Log
      .addFile(options.logPath || LOG_PATH)
      .line()

    try {

      Application.stop(options.pidPath || PID_PATH)

      FileSystem.whenFileNotExists(250, 10000, options.pidPath || PID_PATH)
        .catch((error) => {

          Log.error('- %s\n\n%s\n', error.message, error.stack)

          console.log('An error occured stopping the server process.\n')
          console.log(error.stack)

          Process.exit(1)

        })

    }
    catch(error) {

      Log.error('- %s\n\n%s\n', error.message, error.stack)

      console.log('An error occured stopping the server process.\n')
      console.log(error.stack)

      Process.exit(1)

    }

  })

Command.parse(process.argv)
