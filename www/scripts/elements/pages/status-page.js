'use strict'

const Co = require('co')

const Log = require('../../log')
const NavigatedPage = require('./navigated-page')
const StatusElement = require('./status-element')

const ContentFn = require('./status-page.pug')

class StatusPage extends NavigatedPage {

  constructor(contentFn = ContentFn) {
    super(contentFn)
    this.statusElement = new StatusElement()
  }

  bind() {
    super.bind()

    this.statusElement.bind()

    this.getContent().querySelector('#goRefresh').addEventListener('click', this._onGoRefresh = this.onGoRefresh.bind(this))

  }

  unbind() {

    this.getContent().querySelector('#goRefresh').removeEventListener('click', this._onGoRefresh)

    this.statusElement.unbind()

    super.unbind()
  }

  onGoRefresh() {

    let self = this

    Co(function* () {

      try {
        Log.debug('- StatusPage.onGoRefresh()')
        yield self.statusElement.updateContent()
      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

  onShown(isInitial) {
    super.onShown(isInitial)

    let self = this

    Co(function* () {

      try {
        Log.debug('- StatusPage.onShown(%s)', isInitial)
        yield self.statusElement.updateContent()
      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

}

module.exports = StatusPage
