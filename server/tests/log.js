'use strict'

const Assert = require('assert')
const Sinon = require('sinon')
const Utilities = require('util')
const Winston = require('winston')

const FileSystem = require('../library/file-system')
const Log = require('../library/log')
const Package = require('../../package.json')
const Path = require('../library/path')
const Process = require('../library/process')

const LOG_PATH = Path.join(Process.LOG_PATH, `${Package.name}.mocha.log`)

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

  describe('inspect', () => {

    describe('(support)', () => {

      it('should support Log.inspect', () => {
        Assert.doesNotThrow(() => Log.inspect({
          'value': 0
        }))
      })

    })

    describe('(call)', () => {

      before(() => {

        Sinon.spy(Log, 'debug')
        Sinon.spy(Log, 'inspect')
        Sinon.spy(Utilities, 'inspect')

        Log.inspect({
          'value': 0
        })

      })

      it('should call Log.debug', () => {
        Assert.ok(Log.debug.calledOnce)
      })

      it('should call Utilities.inspect', () => {
        Assert.ok(Utilities.inspect.calledOnce)
      })

      it('should return Log', () => {
        Assert.ok(Log.inspect.returned(Log))
      })

      after(() => {
        Utilities.inspect.restore()
        Log.inspect.restore()
        Log.debug.restore()
      })

    })

  })

})
