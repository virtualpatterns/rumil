'use strict'

const Selection = require('../selection')

class NavigatedSelection extends Selection {

  constructor() {
    super()
  }

  static getTopPage() {
    return document
            .querySelector('ons-page:last-child')
  }

}

module.exports = NavigatedSelection
