'use strict'

// const DiffFn = require('virtual-dom/diff')
const Emitter = require('event-emitter')
const Is = require('@pwn/is')
// const PatchFn = require('virtual-dom/patch')
const Utilities = require('util')
// const VirtualContentFn = require('virtual-dom/vnode/vnode')
// const VirtualTextFn = require('virtual-dom/vnode/vtext')
// const VirtualizeContentFn = require('vdom-virtualize')
// const VirtualizeHTMLFn = require('vdom-parser')

const Log = require('./log')

const ContentFn = require('./element.pug')

// const VirtualizeHTMLFn = _VirtualizeHTMLFn({
//   'VNode': VirtualContentFn,
//   'VText': VirtualTextFn
// })

class Element {

  constructor(contentFn = ContentFn) {
    this.id = Utilities.format('id_%d', Element.nextId++)
    this.contentFn = contentFn
    this.emitter = Emitter(this)
  }

  addContent(parentOrSelector = 'html > body', location = 'beforeend', data = {}) {
    // Log.debug('- Element.addContent(%s, %j, data)\n%s\n\n', Is.string(parentOrSelector) ? `"${parentOrSelector}"` : 'parentOrSelector', location, this.renderContent())
    Log.debug('- Element.addContent(%s, %j, data)', Is.string(parentOrSelector) ? `"${parentOrSelector}"` : 'parentOrSelector', location)

    let parent = Is.string(parentOrSelector) ? document.querySelector(parentOrSelector) : parentOrSelector

    parent.insertAdjacentHTML(location, this.renderContent(data))

    this.addContentElement()
    this.bindEvents()

  }

  addContentElement() {
    this.getContent().getElement = () => {
      return this
    }
  }

  renderContent(data = {}) {

    data.application = window.application
    data.element = this

    return this.contentFn(data)

  }

  getContent() {
    return document.getElementById(this.id)
  }

  updateContent(data = {}) {
    Log.debug('- Element.updateContent()')

    let parent = this.getContent().parentNode

    this.removeContent()
    this.addContent(parent, 'beforeend', data)

  }

  removeContent() {
    Log.debug('- Element.removeContent() this.id=%j', this.id)
    this.unbindEvents()
    this.removeContentElement()
    this.getContent().remove()
  }

  removeContentElement() {
    delete this.getContent().getElement
  }

  bindEvents() {}

  unbindEvents() {}

  onEvent(type, eventFn) {
    this.emitter.on(type, eventFn)
  }

  onceEvent(type, eventFn) {
    this.emitter.once(type, eventFn)
  }

  offEvent(type, eventFn) {
    this.emitter.off(type, eventFn)
  }

  emitEvent(...parameters) {
    // Log.debug('- Element.emitEvent( ... )\n\n%s\n\n', Utilities.inspect(parameters))
    this.emitter.emit.apply(this.emitter, parameters)
  }

  toString() {
    return this.renderContent()
  }

}

Element.nextId = 0

module.exports = Element
