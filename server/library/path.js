'use strict'

const _Path = require('path')
const Resolve = require('resolve-path')

let Path = Object.create(_Path)

Path.resolve = function (path) {
  return this.isAbsolute(path) ? path : Resolve(path)
}

Path.trim = function(path) {
  const Process = require('./process')
  return path.replace(Process.cwd(), '.')
}

module.exports = Path
