'use strict'

const Mocha = mocha

const Is = require('@pwn/is')
// const Mocha = require('mocha')
const Utilities = require('util')

// const Page = require('../page')
const Log = require('../../log')
const NavigatedPage = require('./navigated-page')
const TestElement = require('./test-element')

const ContentFn = require('./test-page.pug')

class TestPage extends NavigatedPage {

  constructor(contentFn = ContentFn) {
    super(contentFn)
    this.testElement = new TestElement()
  }

  bindEvents() {
    super.bindEvents()

    // if (this.getContent().querySelector('#goBack'))
    //   this.getContent().querySelector('#goBack').addEventListener('click', this._onGoBack = this.onGoBack.bind(this))

    // this.onEvent('shown', this._onShown = this.onShown.bind(this))

  }

  unbindEvents() {

    // this.offEvent('shown', this._onShown)

    // if (this.getContent().querySelector('#goBack'))
    //   this.getContent().querySelector('#goBack').removeEventListener('click', this._onGoBack)

    super.unbindEvents()
  }

  // onGoBack() {
  //   Log.debug('- TestPage.onGoBack()')
  //   window.application.popPage()
  //     .catch((error) => window.application.showError(error))
  // }

  onShown(isInitial) {
    super.onShown(isInitial)

    Log.debug('- TestPage.onShown(%s)', isInitial)

    if (isInitial) {

      if (Is.function(window.initMochaPhantomJS))
        window.initMochaPhantomJS()

      // let tests = new Mocha({
      //   'bail': true,
      //   'timeout': 0,
      //   'ui': 'bdd'
      // })

      Mocha.setup({
        'bail': true,
        'timeout': 0,
        'ui': 'bdd'
      })

      require('../../tests/default-page')

      // let testRunner = tests.run()
      let testRunner = Mocha.run()
      testRunner.on('end', this.onFinished.bind(this, testRunner.stats))

    }

  }

  onFinished(statistics) {
    Log.debug('- TestPage.onFinished(statistics)\n\n%s\n\n', Utilities.inspect(statistics))
    this.testElement.updateContent(statistics)
      .catch((error) => window.application.showError(error))
  }

 // *   - `start`  execution started
 // *   - `end`  execution complete
 // *   - `suite`  (suite) test suite execution started
 // *   - `suite end`  (suite) all tests (and sub-suites) have finished
 // *   - `test`  (test) test execution started
 // *   - `test end`  (test) test completed
 // *   - `hook`  (hook) hook execution started
 // *   - `hook end`  (hook) hook complete
 // *   - `pass`  (test) test passed
 // *   - `fail`  (test, err) test failed
 // *   - `pending`  (test) test pending

}

module.exports = TestPage
