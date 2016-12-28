'use strict'

const Co = require('co')

const SimpleAlertDialog = require('./simple-alert-dialog')
const Log = require('../../log')

const ContentFn = require('./alert-dialog.pug')

class AlertDialog extends SimpleAlertDialog {

  constructor(text, title = 'Alert', contentFn = ContentFn) {
    super(contentFn)
    this.text = text
    this.title = title
  }

  bind() {
    super.bind()

    this.getContent().querySelector('#ok').addEventListener('click', this._onOk = Co.wrap(this.onOk).bind(this))

  }

  unbind() {

    this.getContent().querySelector('#ok').removeEventListener('click', this._onOk)

    super.unbind()
  }

  *onOk() {
    Log.debug('- AlertDialog.onOk()')
    yield window.application.hideDialog(this, false)
  }

}

module.exports = AlertDialog
