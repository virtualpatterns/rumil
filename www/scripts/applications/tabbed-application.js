'use strict'

const Application = require('../application')

const ContentFn = require('./tabbed-application.pug')

class TabbedApplication extends Application {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

}

module.exports = TabbedApplication
