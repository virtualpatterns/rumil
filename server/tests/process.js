'use strict'

const Assert = require('assert')
const ChildProcess = require('child_process')
// const Sinon = require('sinon')

const FileSystem = require('../library/file-system')
const Package = require('../../package.json')
const Path = require('../library/path')
const Process = require('../library/process')

const ArgumentError = require('../library/errors/argument-error')

const PID_PATH = Path.join(Process.PID_PATH, `${Package.name}.mocha.pid`)

const MODULE_PATH = Path.join(__dirname, 'resources', `process.killPID.js`)
const MODULE_LOG_PATH = Path.join(Process.LOG_PATH, `process.killPID.log`)
const MODULE_PID_PATH = Path.join(Process.PID_PATH, `process.killPID.pid`)

describe('Process', () => {

  // it('should have created the log directory', (callback) => {
  //   FileSystem.access(Process.LOG_PATH, FileSystem.F_OK, callback)
  // })
  //
  // it('should have created the output directory', (callback) => {
  //   FileSystem.access(Process.OUTPUT_PATH, FileSystem.F_OK, callback)
  // })
  //
  // it('should have created the pid directory', (callback) => {
  //   FileSystem.access(Process.PID_PATH, FileSystem.F_OK, callback)
  // })

  describe('when', () => {

    describe('(when a test succeeds)', () => {

      it('should resolve the promise', (callback) => {
        Process.when(250, 1000, (callback) => callback())
          .then(() => callback())
          .catch((error) => callback(error))
      })

    })

    describe('(when a test fails)', () => {

      it('should reject the promise', (callback) => {
        Process.when(250, 1000, (callback) => callback(true))
          .then(() => callback(new Error()))
          .catch((error) => callback())
      })

    })

  })

  describe('existsPID', () => {

    describe('(return true)', () => {

      describe('(when the file exists and contains a valid pid)', () => {

        before((callback) => {

          Promise.resolve()
            .then(() => FileSystem.Promise.accessUnlink(PID_PATH, FileSystem.F_OK))
            .then(() => {
              return FileSystem.Promise.writeFile(PID_PATH, Process.pid, {
                encoding: 'utf-8'
              })
            })
            .then(() => callback())
            .catch((error) => callback(error))

        })

        it('should return true', () => {
          Assert.equal(Process.existsPID(PID_PATH), true)
        })

        after((callback) => {
          FileSystem.unlink(PID_PATH, callback)
        })

      })

    })

    describe('(return false)', () => {

      describe('(when the file doesn\'t exist)', () => {

        before((callback) => {
          FileSystem.accessUnlink(PID_PATH, FileSystem.F_OK, callback)
        })

        it('should return false', () => {
          Assert.equal(Process.existsPID(PID_PATH), false)
        })

      })

      describe('(when the file exists and contains an invalid pid)', () => {

        before((callback) => {

          Promise.resolve()
            .then(() => FileSystem.Promise.accessUnlink(PID_PATH, FileSystem.F_OK))
            .then(() => FileSystem.Promise.writeFile(PID_PATH, 2^16, {
              encoding: 'utf-8'
            }))
            .then(() => callback())
            .catch((error) => callback(error))

        })

        it('should return false', () => {
          Assert.equal(Process.existsPID(PID_PATH), false)
        })

      })

      describe('(when the file contains an invalid pid)', () => {

        before((callback) => {

          Promise.resolve()
            .then(() => FileSystem.Promise.accessUnlink(PID_PATH, FileSystem.F_OK))
            .then(() => FileSystem.Promise.writeFile(PID_PATH, 2^16, {
              encoding: 'utf-8'
            }))
            .then(() => Assert.equal(Process.existsPID(PID_PATH), false))
            .then(() => callback())
            .catch((error) => callback(error))

        })

        it('should delete the file', (callback) => {
          FileSystem.access(PID_PATH, FileSystem.F_OK, (error) => {
            if (error)
              callback()
            else
              callback(new Error(`The file ${Path.trim(PID_PATH)} exists.`))
          })
        })

      })

    })

  })

  describe('createPID', () => {

    // describe('(call)', () => {
    //
    //   before(() => {
    //     return Promise.resolve()
    //       .then(() => {
    //         Sinon.spy(Process, 'createPID')
    //         Sinon.spy(Process, 'on')
    //       })
    //       .then(() => FileSystem.Promise.accessUnlink(PID_PATH, FileSystem.F_OK))
    //       .then(() => Process.createPID(PID_PATH))
    //   })
    //
    //   it('should call Process.on', () => {
    //     Assert.ok(Process.on.calledOnce)
    //   })
    //
    //   it('should call Process.on with arguments', () => {
    //     Assert.ok(Process.on.calledWith('exit'))
    //   })
    //
    //   it('should return Process', () => {
    //     Assert.ok(Process.createPID.returned(Process))
    //   })
    //
    //   after(() => {
    //     return Promise.resolve()
    //       .then(() => FileSystem.Promise.accessUnlink(PID_PATH, FileSystem.F_OK))
    //       .then(() => {
    //         Process.on.restore()
    //         Process.createPID.restore()
    //       })
    //   })
    //
    // })

    describe('(parent process)', () => {

      before((callback) => {

        Promise.resolve()
          .then(() => FileSystem.Promise.accessUnlink(PID_PATH, FileSystem.F_OK))
          .then(() => Process.createPID(PID_PATH))
          .then(() => callback())
          .catch((error) => callback(error))

      })

      it('should create the file', (callback) => {
        FileSystem.access(PID_PATH, FileSystem.F_OK, callback)
      })

      it('should create the file with a valid pid', () => {
        FileSystem.readFile(PID_PATH, {
          encoding: 'utf-8'
        }, (pid) => Assert.equal(pid, process.pid))
      })

      it('should fail if the file exists', () => {
        Assert.throws(() => Process.createPID(PID_PATH), ArgumentError)
      })

    })

    describe('(child process)', () => {

      describe('(on fork)', () => {

        let childProcess = null

        before((callback) => {

          Promise.resolve()
            .then(() => FileSystem.Promise.accessUnlink(MODULE_PID_PATH, FileSystem.F_OK))
            .then(() => {
              childProcess = ChildProcess.fork(MODULE_PATH, [
                '--logPath',
                MODULE_LOG_PATH,
                '--pidPath',
                MODULE_PID_PATH
              ], {
                'silent': true
              })
              // return Promise.resolve()
            })
            .then(() => callback())
            .catch((error) => callback(error))

        })

        it('should create the file', (callback) => {
          FileSystem.whenFileExists(250, 5000, MODULE_PID_PATH)
            .then(() => callback())
            .catch((error) => callback(error))
        })

        after((callback) => {

          Promise.resolve()
            .then(() => childProcess.send({}))
            .then(() => FileSystem.whenFileNotExists(250, 10000, MODULE_PID_PATH))
            .then(() => callback())
            .catch((error) => callback(error))

        })

      })

      describe('(on exit)', () => {

        let childProcess = null

        before((callback) => {

          Promise.resolve()
            .then(() => FileSystem.Promise.accessUnlink(MODULE_PID_PATH, FileSystem.F_OK))
            .then(() => {
              childProcess = ChildProcess.fork(MODULE_PATH, [
                '--logPath',
                MODULE_LOG_PATH,
                '--pidPath',
                MODULE_PID_PATH
              ], {
                'silent': true
              })
              // return Promise.resolve()
            })
            .then(() => FileSystem.whenFileExists(250, 5000, MODULE_PID_PATH))
            .then(() => childProcess.send({}))
            .then(() => callback())
            .catch((error) => callback(error))

        })

        it('should delete the file on exit', (callback) => {
          FileSystem.whenFileNotExists(250, 10000, MODULE_PID_PATH)
            .then(() => callback())
            .catch((error) => callback(error))
        })

      })

    })

  })

  describe('killPID', () => {

    describe('(when the file exists and contains a valid pid)', () => {

      let childProcess = null

      before((callback) => {

        Promise.resolve()
          .then(() => FileSystem.Promise.accessUnlink(MODULE_PID_PATH, FileSystem.F_OK))
          .then(() => {
            childProcess = ChildProcess.fork(MODULE_PATH, [
              '--logPath',
              MODULE_LOG_PATH,
              '--pidPath',
              MODULE_PID_PATH
            ], {
              'silent': true
            })
            // return Promise.resolve()
          })
          .then(() => FileSystem.whenFileExists(250, 5000, MODULE_PID_PATH))
          .then(() => Process.killPID(MODULE_PID_PATH))
          .then(() => callback())
          .catch((error) => callback(error))

      })

      it('should delete the file', (callback) => {
        FileSystem.whenFileNotExists(250, 10000, MODULE_PID_PATH)
          .then(() => callback())
          .catch((error) => callback(error))
      })

    })

    describe('(when the file doesn\'t exist)', () => {

      before((callback) => {
        FileSystem.Promise.accessUnlink(MODULE_PID_PATH, FileSystem.F_OK)
          .then(() => callback())
          .catch((error) => callback(error))
      })

      it('should fail', () => {
        Assert.throws(() => Process.killPID(MODULE_PID_PATH), ArgumentError)
      })

    })

    describe('(when the file exists and contains an invalid pid)', () => {

      before((callback) => {

        Promise.resolve()
          .then(() => FileSystem.Promise.accessUnlink(MODULE_PID_PATH, FileSystem.F_OK))
          .then(() => FileSystem.Promise.writeFile(MODULE_PID_PATH, 2^16, {
            encoding: 'utf-8'
          }))
          .then(() => callback())
          .catch((error) => callback(error))

      })

      it('should fail', () => {
        Assert.throws(() => Process.killPID(MODULE_PID_PATH), ArgumentError)
      })

    })

  })

})
