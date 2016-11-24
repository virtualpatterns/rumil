'use strict'

const Directory = require('mkdirp')
const _FileSystem = require('fs')
const Promisify = require("es6-promisify");
// const Utilities = require('util')

const Path = require('./path')

const ArgumentError = require('./errors/argument-error')
const ProcessError = require('./errors/process-error')

let FileSystem = Object.create(_FileSystem)

FileSystem.mkdirp = Directory

FileSystem.accessUnlink = function(path, mode, callback) {

  const Log = require('./log')

  // Log.debug('> FileSystem.accessUnlink(%j, %d, callback)', Path.trim(path), mode)

  FileSystem.access(path, mode, (error) => {
    if (error) {
      // Log.error('- FileSystem.access(%j, %d, (error) => { ... })', Path.trim(path), mode)
      // Log.error('    error.message=%j\n\n%s\n', error.message, error.stack);
      callback()
    }
    else {
      // Log.debug('- FileSystem.unlink(%j, callback)', Path.trim(path))
      FileSystem.unlink(path, callback)
    }
  })

}

FileSystem.whenFileExists = function(timeout, maximumDuration, path) {

  const Log = require('./log')
  const Process = require('./process')

  Log.debug('- FileSystem.whenFileExists(%d, %d, %j) { ... }', timeout, maximumDuration, Path.trim(path))

  return Process.when(timeout, maximumDuration, (callback) => FileSystem.access(path, FileSystem.F_OK, callback))

}

FileSystem.whenFileNotExists = function(timeout, maximumDuration, path) {

  const Log = require('./log')
  const Process = require('./process')

  Log.debug('- FileSystem.whenFileNotExists(%d, %d, %j) { ... }', timeout, maximumDuration, Path.trim(path))

  return Process.when(timeout, maximumDuration, (callback) => {
    FileSystem.access(path, FileSystem.F_OK, (error) => {
      if (error)
        callback()
      else
        callback(new ArgumentError(`The file ${Path.trim(path)} exists.`))
    })
  })

}

FileSystem.Promise = {}
FileSystem.Promise.access = Promisify(FileSystem.access)
FileSystem.Promise.accessUnlink = Promisify(FileSystem.accessUnlink)
FileSystem.Promise.readFile = Promisify(FileSystem.readFile)
FileSystem.Promise.unlink = Promisify(FileSystem.unlink)
FileSystem.Promise.writeFile = Promisify(FileSystem.writeFile)

module.exports = FileSystem
