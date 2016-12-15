'use strict'

const Emitter = require('event-emitter')
const Is = require('@pwn/is')
const Utilities = require('util')

const Log = require('./log')

const ElementError = require('./errors/element-error')

const ContentFn = require('./element.pug')

class Element {

  constructor(isUpdateable = false, contentFn = ContentFn) {
    this.id = `id_${Element.nextId++}`
    this.isUpdateable = isUpdateable
    this.contentFn = contentFn
    this.emitter = Emitter(this)
  }

  addAllContent(parentOrSelector = 'html > body', location = 'beforeend', data = {}) {

    if (this.isUpdateable) {

      const Container = require('./elements/container')
      return Container.addContent(parentOrSelector, location, {
        'contentElement': this,
        'contentData': data
      })

    }
    else
      return this.addContent(parentOrSelector, location, data)

  }

  addContent(parentOrSelector = 'html > body', location = 'beforeend', data = {}) {

    let parent = Is.string(parentOrSelector) ? document.querySelector(parentOrSelector) : parentOrSelector
    let content = this.renderContent(data)

    parent.insertAdjacentHTML(location, content)

    this.bind()

  }

  renderAllContent(data = {}) {

    if (this.isUpdateable) {

      const Container = require('./elements/container')
      return Container.renderContent({
        'contentElement': this,
        'contentData': data
      })

    }
    else
      return this.renderContent(data)

  }

  renderContent(data = {}) {
    return this.contentFn({
      // Modules
      'Is': Is,

      // Globals
      'application': window.application,
      'element': this,

      // Locals
      'data': data

    })
  }

  getContent() {
    return document.getElementById(this.id)
  }

  updateContent(data = {}) {
    // Log.debug('- Element.updateContent()')

    if (this.isUpdateable) {

      let parent = this.getContent().parentNode

      this.removeContent()
      this.addContent(parent, 'beforeend', data)

    }
    else
      throw new ElementError(`The element is not updateable.`)

  }

  removeContent() {
    // Log.debug('- Element.removeContent() this.id=%j', this.id)

    this.unbind()
    // this.removeContentElement()

    this.getContent().remove()

  }

  addContentElement() {
    this.getContent().getElement = () => {
      return this
    }
  }

  removeContentElement() {
    delete this.getContent().getElement
  }

  bind() {
    this.addContentElement()
  }

  unbind() {
    this.removeContentElement()
  }

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

  toString(data = {}) {
    return this.renderAllContent(data)
  }

}

Element.nextId = 0

module.exports = Element
