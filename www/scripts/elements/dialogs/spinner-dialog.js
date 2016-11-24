'use strict'

const Dialog = require('../dialog')
const Log = require('../../log')

const ContentFn = require('./spinner-dialog.pug')

class SpinnerDialog extends Dialog {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

}

module.exports = SpinnerDialog
