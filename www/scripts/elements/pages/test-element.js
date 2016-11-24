'use strict'

const _Date = require('datejs')
const Timeout = require('timer-promise')

const Element = require('../../element')
const Log = require('../../log')

const ContentFn = require('./test-element.pug')

class TestElement extends Element {

  constructor(contentFn = ContentFn) {
    super(true, contentFn)
    // this.statistics = {}
  }

  renderContent(data = {}) {
    Log.debug('- TestElement.renderContent(data)')

    data.statistics = data.statistics || {}

    return super.renderContent(data)

  }

  updateContent(statistics = {}) {
    Log.debug('- TestElement.updateContent(data)')

    return super.updateContent({
      'statistics': statistics
    })

  }

}

module.exports = TestElement
