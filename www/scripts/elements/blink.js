'use strict'

const Is = require('@pwn/is')
const Queue = require('../update-content-queue')
const Utilities = require('util')

const Element = require('../element')
const Log = require('../log')

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

module.exports = Blink
