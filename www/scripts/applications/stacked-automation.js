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

    return new Promise((resolve) => {

      let _onPageShown = null

      // Log.debug('> window.application.on(\'pageShown\', (page, isInitial) => { ... })')
      window.application.once('pageShown', _onPageShown = (page, isInitial) => {
        // window.application.off('pageShown', _onPageShown)
        Log.debug('- window.application.on(\'pageShown\', (page, %j) => { ... }) page.id=%j', isInitial, page.id)
        resolve({
          'page': page,
          'isInitial': isInitial
        })
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
