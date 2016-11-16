'use strict'

const SimpleAlertDialog = require('./simple-alert-dialog')
const Log = require('../../log')

const ContentFn = require('./alert-dialog.pug')

class AlertDialog extends SimpleAlertDialog {

  constructor(text, title = 'Alert', contentFn = ContentFn) {
    super(contentFn)
    this.text = text
    this.title = title
  }

  bindEvents() {
    super.bindEvents()

    this.getContent().querySelector('#ok').addEventListener('click', this._onOk = this.onOk.bind(this))

  }

  unbindEvents() {

    this.getContent().querySelector('#ok').removeEventListener('click', this._onOk)

    super.unbindEvents()
  }

  onOk() {
    Log.debug('- AlertDialog.onOk()')
    window.application.hideDialog(this)
  }

}

module.exports = AlertDialog
