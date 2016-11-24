'use strict'

// function IntervalError(message) {
//
//   Error.call(this)
//   Error.captureStackTrace(this, IntervalError)
//
//   this.message = message
//
// }
//
// IntervalError.prototype = Object.create(Error.prototype)
// IntervalError.prototype.constructor = IntervalError
// IntervalError.prototype.name = IntervalError.name

class IntervalError extends Error {

  constructor(message) {
      super(message)
  }

}

module.exports = IntervalError
