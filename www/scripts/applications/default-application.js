'use strict'

const DefaultPage = require('../elements/pages/default-page')
const StackedApplication = require('./stacked-application')
const Log = require('../log')

const ContentFn = require('./default-application.pug')

class DefaultApplication extends StackedApplication {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

  onReady(Page = DefaultPage) {
    Log.debug('- DefaultApplication.onReady()');
    super.onReady(Page)
  }

}

module.exports = DefaultApplication
