'use strict'

const Automation = require('../automation')
const Log = require('../log')

class NavigatedAutomation extends Automation {

  constructor() {
    super()
  }

  static whenPageShown(whenFn) {
    Log.debug('- Automation.whenPageShown(whenFn)')
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
  //   Selection
  //     .getToolbarButton(text)
  //     .click()
  // }
  //
  // static clickTappableListItem(text) {
  //   Selection
  //     .getTappableListItem(text)
  //     .click()
  // }

}

module.exports = NavigatedAutomation
