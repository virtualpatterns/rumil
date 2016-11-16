'use strict'

const Dialog = require('../dialog')
const Log = require('../../log')

const ContentFn = require('./test-dialog.pug')

class TestDialog extends Dialog {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

}

module.exports = TestDialog
