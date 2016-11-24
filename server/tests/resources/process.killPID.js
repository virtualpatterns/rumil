'use strict'

const Command = require('commander')
const Utilities = require('util')

const Log = require('../../library/log')
const Package = require('../../../package.json')
const Path = require('../../library/path')
const Process = require('../../library/process')

Command
  .version(Package.version)
  .option('--logPath <path>', 'Log path')
  .option('--pidPath <path>', 'PID path')
  .parse(Process.argv)

if (Command.logPath &&
    Command.pidPath) {

  Log.addFile(Command.logPath)
  Log.debug('--------------------------------------------------------------------------------')

  Process.createPID(Command.pidPath)

  Process.on('message', (message) => {
    Log.debug(`- Process.on(\'message\', (message) => { ... })\n\n${Utilities.inspect(message)}`)
    Log.debug('--------------------------------------------------------------------------------')
    Log.removeFile(Command.logPath)
    Process.exit(1)
  })

  Process.once('SIGINT', () => {
    Log.debug('- Process.once(\'SIGINT\', () => { ... })');
    Log.debug('--------------------------------------------------------------------------------')
    Log.removeFile(Command.logPath)
    Process.exit(2);
  });

  function wait(start) {
    Log.debug(`- wait(${start.toISOString()}) ${(new Date()) - start}ms`);
    setTimeout(() => wait(start), 60000)
  }

  wait(new Date())

}
