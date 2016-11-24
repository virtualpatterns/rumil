'use strict'

const FileSystem = require('./file-system')
const Path = require('./path')

const ArgumentError = require('./errors/argument-error')
const ProcessError = require('./errors/process-error')

const EXIT_TIMEOUT = 5000

let Process = Object.create(process)

Process.LOG_PATH = Path.join(Process.cwd(), 'process', 'logs')
Process.OUTPUT_PATH = Path.join(Process.cwd(), 'process', 'output')
Process.PID_PATH = Path.join(Process.cwd(), 'process', 'pids')

// FileSystem.mkdirp.sync(Process.LOG_PATH)
// FileSystem.mkdirp.sync(Process.OUTPUT_PATH)
// FileSystem.mkdirp.sync(Process.PID_PATH)

// Object.defineProperty(Process, 'exitCode', {
//   enumerable: true,
//   get: function() {
//     return process.exitCode
//   },
//   set: function(value) {
//     process.exitCode = value
//   }
// })

Process.when = function(timeout, maximumDuration, testFn) {

  const Log = require('./log')

  Log.debug('> Process.when(%d, %d, testFn) { ... }', timeout, maximumDuration)

  return new Promise((resolve, reject) => {

    let waitLoop = function(start) {

      let duration = (new Date()) - start

      testFn((error) => {
        if (error &&
            duration < maximumDuration)
          setTimeout(() => waitLoop(start), timeout)
        else if (duration >= maximumDuration) {
          Log.error('< Process.when(%d, %d, testFn) { ... } duration=%d', timeout, maximumDuration, duration)
          reject(new ProcessError('Duration exceeded.'))
        }
        else {
          Log.debug('< Process.when(%d, %d, testFn) { ... }', timeout, maximumDuration)
          resolve()
        }
      })

    }

    waitLoop(new Date())

  })

}

Process.existsPID = function(path) {

  const FileSystem = require('./file-system')
  const Log = require('./log')

  try {
    FileSystem.accessSync(path, FileSystem.F_OK)
  }
  catch (error) {
    return false
  }

  let pid = FileSystem.readFileSync(path, {
    encoding: 'utf-8'
  })

  try {
    process.kill(pid, 0)
  } catch (error) {

    Log.debug('- FileSystem.unlinkSync(%j)', Path.trim(path))
    FileSystem.unlinkSync(path)

    return false

  }

  return true

}

Process.createPID = function(path) {

  const FileSystem = require('./file-system')
  const Log = require('./log')

  Log.debug('> Process.createPID(%j)', Path.trim(path))

  if (this.existsPID(path))
    throw new ArgumentError(`The path ${Path.trim(path)} exists.`)
  else {

    Log.debug('- FileSystem.writeFileSync(%j, %d, ...)', Path.trim(path), process.pid)
    FileSystem.writeFileSync(path, process.pid, {
      encoding: 'utf-8'
    })

    process.on('exit', () => {
      console.log('> Process.on(\'exit\', function() { ... }')
      try {
        FileSystem.accessSync(path, FileSystem.F_OK)
        FileSystem.unlinkSync(path)
        console.log('< Process.on(\'exit\', function() { ... }')
      }
      catch (error) {
        console.log('< Process.on(\'exit\', function() { ... }')
        console.log('    error.message=%j\n\n%s\n\n', error.message, error.stack)
      }
    })

  }

  Log.debug('< Process.createPID(%j)', Path.trim(path))

  return this;

}

Process.killPID = function(path, signal = 'SIGINT') {

  const FileSystem = require('./file-system')
  const Log = require('./log')

  Log.debug('> Process.killPID(%j, %j)', Path.trim(path), signal)

  if (this.existsPID(path)) {

    let pid = FileSystem.readFileSync(path, {
      encoding: 'utf-8'
    })

    Log.debug('- process.kill(%d, %j)', pid, signal)

    process.kill(pid, signal)

  }
  else
    throw new ArgumentError(`The path ${Path.trim(path)} does not exist.`)

  Log.debug('< Process.killPID(%j, %j)', Path.trim(path), signal)

  return this;

}

Process.exit = function(code = 0) {

  const Log = require('./log')

  Log.debug('> Process.exit(%d) ...', code)

  setTimeout(() => process.exit(code), EXIT_TIMEOUT)

  return this;

}

module.exports = Process
