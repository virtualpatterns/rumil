'use strict'

const Utilities = require('util')

const DefaultSelect = require('./default-select')
const NavigatedAutomate = require('./navigated-automate')

class DefaultAutomate extends NavigatedAutomate {

  constructor() {
    super()
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

module.exports = DefaultAutomate
