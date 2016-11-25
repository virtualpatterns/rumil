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

const IntervalError = require('./errors/interval-error')
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

  startInterval(selector, from, every = 1000, decrement = 1) {

    return Promise.resolve()
      .then(() => {
        Log.debug('- Element.startInterval(%j, %j, %j, %j)', selector, from, every, decrement)

        return Interval.start(`${this.id} ${selector}`, from, every, decrement, (index) => {
          Log.debug('- Element.startInterval(%j, %j, %j, %j) index=%j', selector, from, every, decrement, index)

          let element = this.getContent().querySelector(selector)

          if (element)
            element.innerHTML = index
          else
            Log.debug('- Element.startInterval(%j, %j, %j, %j) index=%j element=%j', selector, from, every, decrement, index, element)

        })

      })

  }

  stopInterval(selector) {
    Log.debug('- Element.stopInterval(%j)', selector)
    Interval.stop(`${this.id} ${selector}`)
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

class Interval {

  static start(name, ...parameters) { // from = 99, every = 1000, decrement = 1, intervalFn = () => {}) {
    return new Promise((resolve, reject) => {

      // Interval.start('name')
      // Interval.start('name', 10)
      // Interval.start('name', (index) => {})
      // Interval.start('name', 10, (index) => {})
      // Interval.start('name', 10, 1000, (index) => {})
      // Interval.start('name', 10, 1000, 1, (index) => {})

      let from = 10
      let every = 1000
      let decrement = 1
      let intervalFn = (index) => {
        // Log.debug('- Interval.start(%j, %j, %j, %j, intervalFn) index=%j', name, from, every, decrement, index)
      }

      switch (parameters.length) {
        case 0:
          break;
        case 1:
          if (Is.function(parameters[0]))
            intervalFn = parameters[0]
          else
            from = parameters[0]
          break;
        case 2:
          intervalFn = parameters[1]
          from = parameters[0]
          break;
        case 3:
          intervalFn = parameters[2]
          every = parameters[1]
          from = parameters[0]
          break;
        case 4:
          intervalFn = parameters[3]
          decrement = parameters[2]
          every = parameters[1]
          from = parameters[0]
          break;
        default:

      }

      // Log.debug('- Interval.start(%j, %j, %j, %j, intervalFn)', name, from, every, decrement)

      Interval.stop(name)

      let interval = (Interval.intervals[name] = {
        'resolve': resolve,
        'reject': reject,
        'name': name,
        'from': from,
        'every': every,
        'decrement': decrement
      })

      interval.index = interval.from
      intervalFn(interval.index)

      interval.id = setInterval(() => {
        Log.debug('- Interval.start(%j, %j, %j, %j) interval.index=%j', name, from, every, decrement, interval.index)

        interval.index -= interval.decrement

        intervalFn(interval.index)

        if (interval.index <= 0) {
          // Interval.stop(interval.name)
          clearInterval(interval.id)
          delete Interval.intervals[interval.name]
          interval.resolve()
        }

      }, interval.every)

    })
  }

  static stop(name) {
    // Log.debug('- Interval.stop(%j)', name)

    let interval = Interval.intervals[name]

    if (interval) {
      clearInterval(interval.id)
      delete Interval.intervals[interval.name]
      interval.reject(new IntervalError(`The interval "${interval.name}" was stopped.`))
    }

  }

  // static startBySelector(selector, from = 10, every = 1000, decrement = 1) {
  //   return Promise.resolve()
  //     .then(() => {
  //       Log.debug('- Interval.startBySelector(%j, %j, %j, %j)', selector, from, every, decrement)
  //
  //       return Interval.start(selector, from, every, decrement, (index) => {
  //         Log.debug('- Interval.startBySelector(%j, %j, %j, %j) index=%j', selector, from, every, decrement, index)
  //
  //         let element = document.querySelector(selector)
  //
  //         if (element)
  //           element.innerHTML = index
  //         else
  //           Log.debug('- Interval.startBySelector(%j, %j, %j, %j) index=%j element=%j', selector, from, every, decrement, index, element)
  //
  //       })
  //
  //     })
  // }
  //
  // static stopBySelector(selector) {
  //   Log.debug('- Interval.stopBySelector(%j)', selector)
  //   Interval.stop(selector)
  // }

}

Element.nextId = 0
Interval.intervals = {}

module.exports = Element
