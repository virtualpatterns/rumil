'use strict'

const DefaultAutomation = require('./default-automation')
const DefaultPage = require('../elements/pages/default-page')
const DefaultSelect = require('./default-select')
const NavigatedApplication = require('./navigated-application')
const Log = require('../log')
// const TestPage = require('../elements/pages/test-page')

const ContentFn = require('./default-application.pug')

class DefaultApplication extends NavigatedApplication {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

  onReady(Page = DefaultPage) {
    super.onReady(Page)
  }

}

DefaultApplication.Automation = DefaultAutomation
DefaultApplication.Select = DefaultSelect

module.exports = DefaultApplication
