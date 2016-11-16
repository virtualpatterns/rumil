'use strict'

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
})
