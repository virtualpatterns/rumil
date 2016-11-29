'use strict'

const Emitter = require('event-emitter')
const Utilities = require('util')

const Element = require('../element')
const Log = require('../log')

const ContentFn = require('./dialog.pug')

class Dialog extends Element {

  constructor(contentFn = ContentFn) {
    super(false, contentFn)
  }

  emitShown() {
    // Log.debug('- Dialog.emitShown(%s) id=%j', this.id)
    this.emitEvent('shown')
  }

  emitHidden(response) {
    // Log.debug('- Dialog.emitHidden(%s) id=%j', this.id)
    this.emitEvent('hidden', response)
  }

  bind() {
    super.bind()

    this.onEvent('shown', this._onShown = this.onShown.bind(this))
    this.onEvent('hidden', this._onHidden = this.onHidden.bind(this))

  }

  unbind() {

    this.offEvent('hidden', this._onHidden)
    this.offEvent('shown', this._onShown)

    super.unbind()
  }

  onShown() {
    // Log.debug('- Dialog.onShown() id=%j', this.id)
  }

  onHidden(response) {
    // Log.debug('- Dialog.onHidden(response) id=%j\n\n%s\n\n', this.id, Utilities.inspect(response))
  }

}

module.exports = Dialog
