'use strict'

// const Emitter = require('event-emitter')

const Log = require('./log')

const UpdateContentQueueError = require('./errors/update-content-queue-error')

class UpdateContentQueue {

  constructor(maximumNumberOfFns = 1) {
    this.maximumNumberOfFns = maximumNumberOfFns
    this.queuedFns = []
    this.dequeuedFn = null
    // this.emitter = Emitter(this)
  }

  push(fn) {

      return new Promise((resolve, reject) => {
        Log.debug('- UpdateContentQueue.push(fn)')

        while (this.queuedFns.length >= this.maximumNumberOfFns) {
          Log.debug('- DEQUEUE UpdateContentQueue.push(fn)')
          let dequeuedFn = this.queuedFns.pop()
          dequeuedFn.reject(new UpdateContentQueueError('The function is being de-queued.'))
        }

        let queuedFn = {
          'fn': fn,
          'resolve': resolve,
          'reject': reject
        }

        Log.debug('- ENQUEUE UpdateContentQueue.push(fn)')
        this.queuedFns.push(queuedFn)

        this.run()

      })

  }

  run() {

    if (!this.dequeuedFn &&
        this.queuedFns.length > 0) {
    // if (this.queuedFns.length > 0) {

      Log.debug('- DEQUEUE UpdateContentQueue.run()')
      this.dequeuedFn = this.queuedFns.pop()

      this.dequeuedFn.fn()
        .then(() => {

          this.dequeuedFn.resolve()
          this.dequeuedFn = null

          this.run()

        })
        .catch((error) => {

          Log.error('< UpdateContentQueue.run()')
          Log.error(error)

          this.dequeuedFn.reject(error)
          this.dequeuedFn = null

          this.run()

        })

    }

  }

  // onEvent(type, eventFn) {
  //   this.emitter.on(type, eventFn)
  // }
  //
  // onceEvent(type, eventFn) {
  //   this.emitter.once(type, eventFn)
  // }
  //
  // offEvent(type, eventFn) {
  //   this.emitter.off(type, eventFn)
  // }
  //
  // emitEvent(...parameters) {
  //   this.emitter.emit.apply(this.emitter, parameters)
  // }

}

module.exports = UpdateContentQueue
