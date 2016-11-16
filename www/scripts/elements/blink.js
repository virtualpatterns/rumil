'use strict'

const Element = require('../element')
const Log = require('../log')

class Blink extends Element {

  constructor(contentFn) {
    super(contentFn)
  }

  updateContent(data = {}) {
    Log.debug('- Blink.updateContent(data)')

    return new Promise((resolve, reject) => {

      let content = this.getContent()
      let parent = content.parentNode

      let afterVisible = (event) => {
        Log.debug('- afterVisible(event) { ... }')

        parent.removeEventListener('transitionend', afterVisible)

        // Log.debug('- parent.classList.remove(\'rum-invisible\')')
        parent.classList.remove('rum-invisible')

        // Log.debug('- parent.classList.remove(\'rum-visible\')')
        parent.classList.remove('rum-visible')

        resolve()

      }

      let afterInvisible = (event) => {
        Log.debug('- afterInvisible() { ... }')

        parent.removeEventListener('transitionend', afterInvisible)

        // this.removeContent()
        // this.addContent(parent)
        super.updateContent(data)

        parent.classList.add('rum-visible')

        Log.debug('- parent.addEventListener(\'transitionend\', afterVisible)')
        parent.addEventListener('transitionend', afterVisible)

      }

      parent.classList.add('rum-invisible')

      Log.debug('- parent.addEventListener(\'transitionend\', afterInvisible)')
      parent.addEventListener('transitionend', afterInvisible)

    })

  }

}

module.exports = Blink
