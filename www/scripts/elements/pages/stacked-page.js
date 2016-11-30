'use strict'

const Co = require('co')

const Page = require('../page')
const Log = require('../../log')

const ContentFn = require('./stacked-page.pug')

class StackedPage extends Page {

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

    Co(function* () {

      try {
        Log.debug('- StackedPage.onGoBack()')
        window.application.popPage()
      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

}

module.exports = StackedPage
