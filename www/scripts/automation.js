'use strict'

const Utilities = require('util')

const Log = require('./log')
const Selection = require('./selection')

class Automation {

  constructor() {
  }

  static whenDialogShown(whenFn) {
    Log.debug('- Automation.whenDialogShown(whenFn)')
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
    Log.debug('- Automation.whenDialogHidden(whenFn)')
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
    Selection
      .getAlertButton(text)
      .click()
  }

  static clickConfirmationButton(text) {
    this.clickAlertButton(text)
  }

}

module.exports = Automation
