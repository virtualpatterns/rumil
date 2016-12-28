'use strict'

const Co = require('co')

const SimpleAlertDialog = require('./simple-alert-dialog')
const Log = require('../../log')

const ContentFn = require('./confirmation-dialog.pug')

class ConfirmationDialog extends SimpleAlertDialog {

  constructor(text, title = 'Alert', contentFn = ContentFn) {
    super(contentFn)
    this.text = text
    this.title = title
  }

  bind() {
    super.bind()

    this.getContent().querySelector('#yes').addEventListener('click', this._onYes = Co.wrap(this.onYes).bind(this))
    this.getContent().querySelector('#no').addEventListener('click', this._onNo = Co.wrap(this.onNo).bind(this))

  }

  unbind() {

    this.getContent().querySelector('#no').removeEventListener('click', this._onNo)
    this.getContent().querySelector('#yes').removeEventListener('click', this._onYes)

    super.unbind()
  }

  *onYes() {
    Log.debug('- ConfirmationDialog.onYes()')
    yield window.application.hideDialog(this, true)
  }

  *onNo() {
    Log.debug('- ConfirmationDialog.onNo()')
    yield window.application.hideDialog(this, false)
  }

}

module.exports = ConfirmationDialog
