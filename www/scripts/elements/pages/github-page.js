'use strict'

const GitHub = require('github-api')

const Log = require('../../log')
const StackedPage = require('./stacked-page')

const ContentFn = require('./github-page.pug')

class GitHubPage extends StackedPage {

  constructor(token, contentFn = ContentFn) {
    super(contentFn)

    this.token = token
    this.token.scopesAsString = this.token.scopes.join(', ')

  }

}

module.exports = GitHubPage
