'use strict'

function CacheError(message) {

  Error.call(this)
  Error.captureStackTrace(this, CacheError)

  this.message = message

}

CacheError.prototype = Object.create(Error.prototype)
CacheError.prototype.constructor = CacheError
CacheError.prototype.name = CacheError.name

module.exports = CacheError
