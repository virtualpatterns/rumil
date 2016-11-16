'use strict'

const Utilities = require('util')

const DefaultSelection = require('./default-selection')
const NavigatedAutomation = require('./navigated-automation')

class DefaultAutomation extends NavigatedAutomation {

  constructor() {
    super()
  }

  static clickToolbarButton(text) {
    DefaultSelection
      .getToolbarButton(text)
      .click()
  }

  static clickListItem(text) {
    DefaultSelection
      .getListItem(text)
      .click()
  }

}

module.exports = DefaultAutomation
