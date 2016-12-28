'use strict'

const Assert = require('assert')
const Sinon = require('sinon')
const Utilities = require('util')
const Winston = require('winston')

const FileSystem = require('../library/file-system')
const Log = require('../library/log')
const Package = require('../../package.json')
const Pad = require('pad')
const Path = require('../library/path')
const Process = require('../library/process')

const LOG_PATH = Path.join(__dirname, '..', '..', 'process', 'logs', `${Package.name}.mocha.log`)

before(() => {

  Log
    .addFile(LOG_PATH)
    .line()

})

after(() => {

  Log
    .line()
    .removeFile(LOG_PATH)

})

describe('Log', () => {

  it('should create the log file', (callback) => {
    FileSystem.access(LOG_PATH, FileSystem.F_OK, callback)
  })

  describe('format', () => {

    describe('(support with an object)', () => {

      it('should support Log.format', () => {
        Assert.doesNotThrow(() => Log.format({
          'level': 'level',
          'message': 'message'
        }))
      })

    })

    describe('(call with an object)', () => {

      before(() => {

        Sinon.spy(Utilities, 'format')

        Log.format({
          'level': 'level',
          'message': 'message'
        })

      })

      it('should call Utilities.format', () => {
        Assert.ok(Utilities.format.calledOnce)
      })

      after(() => {
        Utilities.format.restore()
      })

    })

    describe('(support with a string)', () => {

      it('should support Log.format', () => {
        Assert.doesNotThrow(() => Log.format('message'))
      })

    })

    describe('(call with a string)', () => {

      before(() => {
        Sinon.spy(Utilities, 'format')
        Log.format('message')
      })

      it('should call Utilities.format', () => {
        Assert.ok(Utilities.format.calledOnce)
      })

      after(() => {
        Utilities.format.restore()
      })

    })

    describe('(support with multiple arguments)', () => {

      it('should support Log.format', () => {
        Assert.doesNotThrow(() => Log.format('message $d %d', 1, 2))
      })

    })

    describe('(call with multiple arguments)', () => {

      before(() => {
        Sinon.spy(Utilities, 'format')
        Log.format('message $d %d', 1, 2)
      })

      it('should call Utilities.format', () => {
        Assert.equal(Utilities.format.callCount, 2)
      })

      after(() => {
        Utilities.format.restore()
      })

    })

  })

  describe('addConsole', () => {

    describe('(support)', () => {

      it('should support Log.addConsole', () => {
        Assert.doesNotThrow(() => Log.addConsole())
      })

      after(() => {
        Log.removeConsole()
      })

    })

    describe('(call)', () => {

      before(() => {

        Sinon.spy(Log, 'add')
        Sinon.spy(Log, 'addConsole')

        Log.addConsole()

      })

      it('should call Log.add', () => {
        Assert.ok(Log.add.calledOnce)
      })

      it('should call Log.add with arguments', () => {
        Assert.ok(Log.add.calledWith(Winston.transports.Console))
      })

      it('should return Log', () => {
        Assert.ok(Log.addConsole.returned(Log))
      })

      after(() => {

        Log.removeConsole()

        Log.addConsole.restore()
        Log.add.restore()

      })

    })

  })

  describe('removeConsole', () => {

    describe('(support)', () => {

      before(() => {
        Log.addConsole()
      })

      it('should support Log.removeConsole', () => {
        Assert.doesNotThrow(() => Log.removeConsole())
      })

    })

    describe('(call)', () => {

      before(() => {

        Sinon.spy(Log, 'remove')
        Sinon.spy(Log, 'removeConsole')

        Log.addConsole()
        Log.removeConsole()

      })

      it('should call Log.remove', () => {
        Assert.ok(Log.remove.calledOnce)
      })

      it('should call Log.remove with arguments', () => {
        Assert.ok(Log.remove.calledWith(Winston.transports.Console))
      })

      it('should return Log', () => {
        Assert.ok(Log.removeConsole.returned(Log))
      })

      after(() => {
        Log.removeConsole.restore()
        Log.remove.restore()
      })

    })

  })

  // describe('inspect', () => {
  //
  //   describe('(support)', () => {
  //
  //     it('should support Log.inspect', () => {
  //       Assert.doesNotThrow(() => Log.inspect({
  //         'value': 0
  //       }))
  //     })
  //
  //   })
  //
  //   describe('(call)', () => {
  //
  //     before(() => {
  //
  //       Sinon.spy(Log, 'debug')
  //       Sinon.spy(Log, 'inspect')
  //       Sinon.spy(Utilities, 'inspect')
  //
  //       Log.inspect({
  //         'value': 0
  //       })
  //
  //     })
  //
  //     it('should call Log.debug', () => {
  //       Assert.ok(Log.debug.calledOnce)
  //     })
  //
  //     it('should call Utilities.inspect', () => {
  //       Assert.ok(Utilities.inspect.calledOnce)
  //     })
  //
  //     it('should return Log', () => {
  //       Assert.ok(Log.inspect.returned(Log))
  //     })
  //
  //     after(() => {
  //       Utilities.inspect.restore()
  //       Log.inspect.restore()
  //       Log.debug.restore()
  //     })
  //
  //   })
  //
  // })

})
