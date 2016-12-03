'use strict'

const Automation = require('../automation')
const Log = require('../log')

class StackedAutomation extends Automation {

  static getTopPage() {
    return document
            .querySelector('ons-page:last-child')
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

module.exports = StackedAutomation