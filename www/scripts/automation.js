'use strict'

const Utilities = require('util')

const Log = require('./log')

class Automation {

  static getTopAlertDialog() {
    return document
            .querySelector('ons-alert-dialog:last-child')
  }

  static getAlertText() {
    return this
            .getTopAlertDialog()
            .querySelector('div.alert-dialog-content')
            .innerText
  }

  static getAlertButton(text) {

    let elements = Array
                    .from(  this
                              .getTopAlertDialog()
                              .querySelectorAll('div.alert-dialog-footer > button.alert-dialog-button')
                              .values() )
                    .filter((element) => {
                      return element.innerText == text
                    })

    return elements.length > 0 ? elements[0] : null

  }

  static existsAlertText(text) {

    let element = this.getTopAlertDialog()

    if (element) {

      let elements = Array
                      .from(  element
                                .querySelectorAll('div.alert-dialog-content')
                                .values() )
                      .filter((element) => {
                        return element.innerText == text
                      })

      return elements.length > 0

    }
    else
      return false

  }

  static getTopConfirmationDialog() {
    return this.getTopAlertDialog()
  }

  static getConfirmationText() {
    return this.getAlertText()
  }

  static getConfirmationButton(text) {
    return this.getAlertButton(text)
  }

  static existsConfirmationText(text) {
    return this.existsAlertText(text)
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
    this
      .getAlertButton(text)
      .click()
  }

  static clickConfirmationButton(text) {
    this.clickAlertButton(text)
  }

}

module.exports = Automation
