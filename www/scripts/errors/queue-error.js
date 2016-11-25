'use strict'

class QueueError extends Error {

  constructor(message) {
      super(message)
  }

}

module.exports = QueueError
