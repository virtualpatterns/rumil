'use strict'

const Search = require('query-string')

const DefaultAutomation = require('./default-automation')
const DefaultPage = require('../elements/pages/default-page')
const DefaultSelection = require('./default-selection')
const NavigatedApplication = require('./navigated-application')
const Log = require('../log')
// const TestPage = require('../elements/pages/test-page')

const ContentFn = require('./default-application.pug')

class DefaultApplication extends NavigatedApplication {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

  onReady() {
    super.onReady()

    let search = Search.parse(window.location.search);

    Log.debug('- DefaultApplication.onReady() search.page=%j', search.page);

    let context = require.context('../elements/pages', true, /-page\.js/)

    Promise.resolve()
      .then(() => Promise.resolve(search.page ? context(search.page) : DefaultPage))
      .then((Page) => Promise.resolve(new Page()))
      .then((page) => this.pushPage(page))
      .catch((error) => window.application.showError(error))

  }

}

DefaultApplication.Automation = DefaultAutomation
DefaultApplication.Selection = DefaultSelection

module.exports = DefaultApplication
