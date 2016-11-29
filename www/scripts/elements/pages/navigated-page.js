'use strict'

const Page = require('../page')
const Log = require('../../log')

const ContentFn = require('./navigated-page.pug')

class NavigatedPage extends Page {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

  bind() {
    super.bind()

    if (this.getContent().querySelector('#goBack'))
      this.getContent().querySelector('#goBack').addEventListener('click', this._onGoBack = this.onGoBack.bind(this))

  }

  unbind() {

    if (this.getContent().querySelector('#goBack'))
      this.getContent().querySelector('#goBack').removeEventListener('click', this._onGoBack)

    super.unbind()
  }

  onGoBack() {
    Log.debug('- NavigatedPage.onGoBack()')
    window.application.popPage()
      .catch((error) => window.application.showError(error))
  }

}

module.exports = NavigatedPage
