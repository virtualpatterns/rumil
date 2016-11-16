'use strict'

const Emitter = require('event-emitter')

const Element = require('../element')
const Log = require('../log')

const ContentFn = require('./page.pug')

class Page extends Element {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

  emitShown(isInitial) {
    // Log.debug('- Page.emitShown(%s) id=%j', isInitial, this.id)
    this.emitEvent('shown', isInitial)
  }

  emitHidden(isFinal) {
    // Log.debug('- Page.emitHidden(%s) id=%j', isFinal, this.id)
    this.emitEvent('hidden', isFinal)
  }

  bindEvents() {
    super.bindEvents()

    // this.getContent().addEventListener('init', this._onAdded = this.onAdded.bind(this))
    // this.getContent().addEventListener('show', this._onShown = this.onShown.bind(this))
    // this.getContent().addEventListener('hide', this._onHidden = this.onHidden.bind(this))
    // this.getContent().addEventListener('destroy', this._onRemoved = this.onRemoved.bind(this))

    this.onEvent('shown', this._onShown = this.onShown.bind(this))
    this.onEvent('hidden', this._onHidden = this.onHidden.bind(this))

  }

  unbindEvents() {

    this.offEvent('hidden', this._onHidden)
    this.offEvent('shown', this._onShown)

    // this.getContent().removeEventListener('destroy', this._onRemoved)
    // this.getContent().removeEventListener('hide', this._onHidden)
    // this.getContent().removeEventListener('show', this._onShown)
    // this.getContent().removeEventListener('init', this._onAdded)

    super.unbindEvents()
  }

  // onAdded() {
  //   Log.debug('- Page.onAdded()')
  // }

  onShown(isInitial) {
    // Log.debug('- Page.onShown(%s) id=%j', isInitial, this.id)
  }

  onHidden(isFinal) {
    // Log.debug('- Page.onHidden(%s) id=%j', isFinal, this.id)
  }

  // onRemoved() {
  //   Log.debug('- Page.onRemoved()')
  // }

}

module.exports = Page
