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

const ElementError = require('./errors/element-error')

const ContentFn = require('./element.pug')

// const VirtualizeHTMLFn = _VirtualizeHTMLFn({
//   'VNode': VirtualContentFn,
//   'VText': VirtualTextFn
// })

class Element {

  constructor(isUpdateable = false, contentFn = ContentFn) {
    this.id = `id_${Element.nextId++}` // Utilities.format('id_%d', Element.nextId++)
    this.isUpdateable = isUpdateable
    this.contentFn = contentFn
    this.emitter = Emitter(this)
  }

  addContent(parentOrSelector = 'html > body', location = 'beforeend', data = {}) {
    // Log.debug('- Element.addContent(%s, %j, data)\n%s\n\n', Is.string(parentOrSelector) ? `"${parentOrSelector}"` : 'parentOrSelector', location, this.renderContent())
    // Log.debug('- Element.addContent(%s, %j, data)', Is.string(parentOrSelector) ? `"${parentOrSelector}"` : 'parentOrSelector', location)

    let parent = Is.string(parentOrSelector) ? document.querySelector(parentOrSelector) : parentOrSelector
    let content = this.renderContent(data)

    // parent.insertAdjacentHTML(location, this.isUpdateable ? require('./elements/container').renderContent(this.id, content) : content)

    parent.insertAdjacentHTML(location, content)

    this.addContentElement()
    this.bindEvents()

  }

  addContentElement() {
    this.getContent().getElement = () => {
      return this
    }
  }

  renderContent(data = {}) {
    // Log.debug('- Element.renderContent(data, %j)\n\n%s\n\n', isContainerIncluded, Utilities.inspect(data))

    data.application = window.application
    data.element = this

    return this.contentFn(data)

    // return this.isUpdateable ? require('./elements/container').renderContent(this.id, this.contentFn(data)) : this.contentFn(data)

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
    // return this.renderContent()

    if (this.isUpdateable) {
      const Container = require('./elements/container')
      return Container.renderContent(this)
    }
    else
      return this.renderContent()

  }

}

Element.nextId = 0

module.exports = Element
