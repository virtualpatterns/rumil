'use strict'

const Automate = require('../automate')
const Log = require('../log')

class NavigatedAutomate extends Automate {

  constructor() {
    super()
  }

  static whenPageShown(whenFn) {
    Log.debug('- Automate.whenPageShown(whenFn)')
    return new Promise((resolve, reject) => {

      // Log.debug('> window.application.on(\'pageShown\', (page, isInitial) => { ... })')
      window.application.on('pageShown', (page, isInitial) => {
        Log.debug('- window.application.on(\'pageShown\', (page, %j) => { ... }) page.id=%j', isInitial, page.id)
        resolve(page, isInitial)
      })

      whenFn()

    })
  }

  // static clickToolbarButton(text) {
  //   Select
  //     .getToolbarButton(text)
  //     .click()
  // }
  //
  // static clickTappableListItem(text) {
  //   Select
  //     .getTappableListItem(text)
  //     .click()
  // }

}

module.exports = NavigatedAutomate
