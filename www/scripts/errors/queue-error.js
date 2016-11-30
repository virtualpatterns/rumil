'use strict'

function QueueError(message) {

  Error.call(this)
  Error.captureStackTrace(this, QueueError)

  this.message = message

}

QueueError.prototype = Object.create(Error.prototype)
QueueError.prototype.constructor = QueueError
QueueError.prototype.name = QueueError.name

// class QueueError extends Error {
//
//   constructor(message) {
//       super(message)
//   }
//
// }

module.exports = QueueError
