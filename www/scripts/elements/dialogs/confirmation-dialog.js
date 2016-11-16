'use strict'

const SimpleAlertDialog = require('./simple-alert-dialog')
const Log = require('../../log')

const ContentFn = require('./confirmation-dialog.pug')

class ConfirmationDialog extends SimpleAlertDialog {

  constructor(text, title = 'Alert', contentFn = ContentFn) {
    super(contentFn)
    this.text = text
    this.title = title
  }

  bindEvents() {
    super.bindEvents()

    this.getContent().querySelector('#yes').addEventListener('click', this._onYes = this.onYes.bind(this))
    this.getContent().querySelector('#no').addEventListener('click', this._onNo = this.onNo.bind(this))

  }

  unbindEvents() {

    this.getContent().querySelector('#no').removeEventListener('click', this._onNo)
    this.getContent().querySelector('#yes').removeEventListener('click', this._onYes)

    super.unbindEvents()
  }

  onYes() {
    Log.debug('- ConfirmationDialog.onYes()')
    window.application.hideDialog(this, true)
  }

  onNo() {
    Log.debug('- ConfirmationDialog.onNo()')
    window.application.hideDialog(this, false)
  }

}

module.exports = ConfirmationDialog
