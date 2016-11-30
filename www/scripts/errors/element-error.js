'use strict'

function ElementError(message) {

  Error.call(this)
  Error.captureStackTrace(this, ElementError)

  this.message = message

}

ElementError.prototype = Object.create(Error.prototype)
ElementError.prototype.constructor = ElementError
ElementError.prototype.name = ElementError.name

module.exports = ElementError
