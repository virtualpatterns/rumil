'use strict'

const Element = require('../element')
const Log = require('../log')

const ContentFn = require('./container.pug')

class Container extends Element {

  constructor(contentFn = ContentFn) {
    super(false, contentFn)
  }

  renderContent(element) {
    return super.renderContent({
      'content': element
    })
  }

}

module.exports = new Container()
