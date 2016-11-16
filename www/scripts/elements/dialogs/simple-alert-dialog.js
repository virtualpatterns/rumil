'use strict'

const Dialog = require('../dialog')
const Log = require('../../log')

const ContentFn = require('./alert-dialog.pug')

class SimpleAlertDialog extends Dialog {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

}

module.exports = SimpleAlertDialog
