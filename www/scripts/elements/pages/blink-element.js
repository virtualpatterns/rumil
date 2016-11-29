'use strict'

// const _Date = require('datejs')
// const Is = require('@pwn/is')

const Blink = require('../blink')
// const Element = require('../../element')
// const Interval = require('../../interval')
const Log = require('../../log')

// const IntervalError = require('../../errors/interval-error')

const ContentFn = require('./blink-element.pug')

// class BlinkElement extends Element {
class BlinkElement extends Blink {

  constructor(contentFn = ContentFn) {
    super(contentFn)
    this.index = 1
  }

  renderContent(data = {}) {
    data.status = data.status || {
      // 'status': {
      //     'index': this.index++,
      //     'nowAsDate': new Date(),
      //     'nowAsDateString': (new Date()).toString('MMM d, yyyy'),
      //     'nowAsTimeString': (new Date()).toString('h:mm:ss tt')
      // }
    }
    return super.renderContent(data)
  }

  updateContent(data = {
    'status': {
        'index': this.index++
    }
  }, options = {
    'off': ['rum-invisible-slow'],
    'on': ['rum-visible-slow']
  }) {
  // updateContent(data = {
  //   'status': {
  //       'index': this.index++
  //   }
  // }) {

    // Log.debug('> BlinkElement.updateContent(data)')
    // super.updateContent(data, options)
    // return super.updateContent(data)
    // Log.debug('< BlinkElement.updateContent(data)')

    return super.updateContent(data, options)

  }

  bind() {
    super.bind()
  }

  unbind() {
    // CountDown.stop(`#${this.id} #onRefreshInterval`)
    super.unbind()
  }

}

module.exports = BlinkElement
