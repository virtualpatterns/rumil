'use strict'

const Is = require('@pwn/is')
// const Queue = require('../blink-queue')
const Utilities = require('util')

const Element = require('../element')
const Log = require('../log')

const QueueError = require('../errors/queue-error')

class Blink extends Element {

  constructor(contentFn) {
    super(true, contentFn)
    this.queue = new Queue()
  }

  updateContent(data = {}, options = {
    'off': ['rum-invisible'],
    'on': ['rum-visible']
  }) {

    return this.queue.push(() => {

      return new Promise((resolve, reject) => {
        // Log.debug('> Blink.updateContent(data)\n\n%s\n\n', Utilities.inspect(data))

        let content = this.getContent()
        let parent = content.parentNode

        let afterVisible = (event) => {
          // Log.debug('- afterVisible(event) { ... }')

          parent.removeEventListener('transitionend', afterVisible)

          // Log.debug('- parent.classList.remove(\'rum-invisible\')')
          // parent.classList.remove('rum-invisible')
          parent.classList.remove.apply(parent.classList, options.off)

          // Log.debug('- parent.classList.remove(\'rum-visible\')')
          // parent.classList.remove('rum-visible')
          parent.classList.remove.apply(parent.classList, options.on)

          // Log.debug('< Blink.updateContent(data)')

          resolve()

        }

        let afterInvisible = (event) => {
          // Log.debug('- afterInvisible() { ... }')

          parent.removeEventListener('transitionend', afterInvisible)

          // this.removeContent()
          // this.addContent(parent)
          super.updateContent(data)

          // parent.classList.add('rum-visible')
          parent.classList.add.apply(parent.classList, options.on)

          // Log.debug('- parent.addEventListener(\'transitionend\', afterVisible)')
          parent.addEventListener('transitionend', afterVisible)

        }

        // parent.classList.add('rum-invisible')
        // Log.debug('- parent.classList.add.apply(parent.classList, %j)', options.off)
        parent.classList.add.apply(parent.classList, options.off)
        // parent.classList.add(options.off)

        // Log.debug('- parent.addEventListener(\'transitionend\', afterInvisible)')
        parent.addEventListener('transitionend', afterInvisible)

      })

    })

  }

}

class Queue {

  constructor(maximumNumberOfFns = 1) {
    this.maximumNumberOfFns = maximumNumberOfFns
    this.queuedFns = []
    this.dequeuedFn = null
    // this.emitter = Emitter(this)
  }

  push(fn) {

      return new Promise((resolve, reject) => {
        Log.debug('- Queue.push(fn)')

        while (this.queuedFns.length >= this.maximumNumberOfFns) {
          Log.debug('- DEQUEUE Queue.push(fn)')
          let dequeuedFn = this.queuedFns.pop()
          dequeuedFn.reject(new QueueError('The function is being de-queued.'))
        }

        let queuedFn = {
          'fn': fn,
          'resolve': resolve,
          'reject': reject
        }

        Log.debug('- ENQUEUE Queue.push(fn)')
        this.queuedFns.push(queuedFn)

        this.run()

      })

  }

  run() {

    if (!this.dequeuedFn &&
        this.queuedFns.length > 0) {
    // if (this.queuedFns.length > 0) {

      Log.debug('- DEQUEUE Queue.run()')
      this.dequeuedFn = this.queuedFns.pop()

      this.dequeuedFn.fn()
        .then(() => {

          this.dequeuedFn.resolve()
          this.dequeuedFn = null

          this.run()

        })
        .catch((error) => {

          Log.error('< Queue.run()')
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

module.exports = Blink
