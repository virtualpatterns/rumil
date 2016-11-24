'use strict'

const Select = require('../select')

class NavigatedSelect extends Select {

  constructor() {
    super()
  }

  static getTopPage() {
    return document
            .querySelector('ons-page:last-child')
  }

}

module.exports = NavigatedSelect
