'use strict'

const Mocha = mocha

const Is = require('@pwn/is')
const Utilities = require('util')

const Log = require('../../log')
const StackedPage = require('./stacked-page')
const TestElement = require('./test-element')

const ContentFn = require('./test-page.pug')

class TestPage extends StackedPage {

  constructor(contentFn = ContentFn) {
    super(contentFn)
    this.testElement = new TestElement()
  }

  bind() {
    super.bind()

    this.testElement.bind()

  }

  unbind() {

    this.testElement.unbind()

    super.unbind()
  }

  onShown(isInitial) {
    Log.debug('- TestPage.onShown(%s)', isInitial)

    super.onShown(isInitial)

    if (isInitial) {

      if (Is.function(window.initMochaPhantomJS))
        window.initMochaPhantomJS()

      Mocha.setup({
        'bail': true,
        'timeout': 0,
        'ui': 'bdd'
      })

      require('../../tests/default-page')

      let tests = Mocha.run()
      tests.on('end', this._onFinished = this.onFinished.bind(this, tests))

    }

  }

  onFinished(tests) {
    Log.debug('- TestPage.onFinished(statistics)\n\n%s\n\n', Utilities.inspect(tests.stats))
    this.testElement.updateContent({
      'statistics': tests.stats
    })
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
