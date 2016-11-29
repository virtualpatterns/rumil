'use strict'

const Utilities = require('util')

const DefaultSelect = require('./default-select')
const NavigatedAutomation = require('./navigated-automation')

class DefaultAutomation extends NavigatedAutomation {

  static getToolbarText() {
    return this
            .getTopPage()
            .querySelector('ons-toolbar > div.center')
            .innerText
  }

  static getToolbarButton(text) {

    let pattern = new RegExp(text, 'i')

    let elements = Array
                    .from(  this
                              .getTopPage()
                              .querySelectorAll('ons-toolbar ons-toolbar-button')
                              .values() )
                    .filter((element) => {
                      return pattern.test(element.innerText)
                    })

    return elements.length > 0 ? elements[0] : null

  }

  static getListItem(text) {

    let elements = Array
                    .from(  this
                              .getTopPage()
                              .querySelectorAll('ons-list-item > div.center')
                              .values() )
                    .filter((element) => {
                      return element.innerText == text
                    })

    return elements.length > 0 ? elements[0] : null

  }

  static existsListItem(text) {
    return this.getListItem(text) != null
  }

  static clickToolbarButton(text) {
    DefaultSelect
      .getToolbarButton(text)
      .click()
  }

  static clickListItem(text) {
    DefaultSelect
      .getListItem(text)
      .click()
  }

}

module.exports = DefaultAutomation
