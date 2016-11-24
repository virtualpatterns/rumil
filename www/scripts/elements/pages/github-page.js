'use strict'

const GitHub = require('github-api')

const Log = require('../../log')
const NavigatedPage = require('./navigated-page')

const ContentFn = require('./github-page.pug')

class GitHubPage extends NavigatedPage {

  constructor(token, contentFn = ContentFn) {
    super(contentFn)



  }

}

module.exports = GitHubPage
