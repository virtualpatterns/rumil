'use strict'

const Log = require('../../log')
const StackedPage = require('./stacked-page')

const ContentFn = require('./settings-page.pug')

class SettingsPage extends StackedPage {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

}

module.exports = SettingsPage
