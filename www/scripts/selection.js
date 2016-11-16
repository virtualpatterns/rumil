'use strict'

class Selection {

  constructor() {
  }

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

}

module.exports = Selection
