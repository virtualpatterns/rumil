'use strict'

const Element = require('../element')
const Log = require('../log')

const ContentFn = require('./template.pug')

class Template extends Element {

  constructor(contents, contentFn = ContentFn) {
    super(contentFn)
    this.contents = contents
  }

}

module.exports = Template
