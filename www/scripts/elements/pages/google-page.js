'use strict'

const Log = require('../../log')
const StackedPage = require('./stacked-page')

const ContentFn = require('./google-page.pug')

class GooglePage extends StackedPage {

  constructor(token, contentFn = ContentFn) {
    super(contentFn)

    this.token = token
    this.token.scopesAsString = this.token.scopes.join(', ')

  }

}

module.exports = GooglePage
