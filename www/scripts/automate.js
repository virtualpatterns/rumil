'use strict'

const Utilities = require('util')

const Log = require('./log')
const Select = require('./select')

class Automate {

  constructor() {
  }

  static whenDialogShown(whenFn) {
    Log.debug('- Automate.whenDialogShown(whenFn)')
    return new Promise((resolve, reject) => {

      // Log.debug('> window.application.on(\'dialogShown\', (dialog) => { ... })')
      window.application.on('dialogShown', (dialog) => {
        Log.debug('- window.application.on(\'dialogShown\', (dialog) => { ... }) dialog.id=%j', dialog.id)
        resolve(dialog)
      })

      whenFn()

    })
  }

  static whenDialogHidden(whenFn) {
    Log.debug('- Automate.whenDialogHidden(whenFn)')
    return new Promise((resolve, reject) => {

      // Log.debug('> window.application.on(\'dialogHidden\', (dialog, response) => { ... })')
      window.application.on('dialogHidden', (dialog, response) => {
        Log.debug('- window.application.on(\'dialogHidden\', (dialog, response) => { ... })\n\n%s\n\n', Utilities.inspect(response))
        resolve(dialog, response)
      })

      whenFn()

    })
  }

  static clickAlertButton(text) {
    Select
      .getAlertButton(text)
      .click()
  }

  static clickConfirmationButton(text) {
    this.clickAlertButton(text)
  }

}

module.exports = Automate
