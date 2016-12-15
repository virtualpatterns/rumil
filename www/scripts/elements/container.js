'use strict'

const Element = require('../element')
const Log = require('../log')

const ContentFn = require('./container.pug')

class Container extends Element {

  constructor(contentFn = ContentFn) {
    super(false, contentFn)
  }

  bind() {}

  unbind() {}

}

module.exports = new Container()
