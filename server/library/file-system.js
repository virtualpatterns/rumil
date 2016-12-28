'use strict'

const Directory = require('mkdirp')
const _FileSystem = require('fs')
const Promisify = require("es6-promisify");
const Touch = require('touch')
// const Utilities = require('util')

const Path = require('./path')

const ArgumentError = require('./errors/argument-error')
const ProcessError = require('./errors/process-error')

let FileSystem = Object.create(_FileSystem)

FileSystem.mkdirp = Directory
FileSystem.touch = Touch

FileSystem.accessUnlink = function(path, mode, callback) {
  FileSystem.access(path, mode, (error) => {
    if (error)
      callback()
    else
      FileSystem.unlink(path, callback)
  })
}

// FileSystem.writeNow = function(path, callback) {
//   FileSystem.writeFile(path, new Date().toISOString(), {
//     'encoding': 'utf-8'
//   }, callback)
// }

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
FileSystem.Promise.mkdirp = Promisify(FileSystem.mkdirp)
FileSystem.Promise.readFile = Promisify(FileSystem.readFile)
FileSystem.Promise.touch = Promisify(FileSystem.touch)
FileSystem.Promise.unlink = Promisify(FileSystem.unlink)
FileSystem.Promise.writeFile = Promisify(FileSystem.writeFile)
// FileSystem.Promise.writeNow = Promisify(FileSystem.writeNow)

module.exports = FileSystem
