'use strict'

const Co = require('co')

const Log = require('../../log')
const StackedPage = require('./stacked-page')
const StatusElement = require('./status-element')

const ContentFn = require('./status-page.pug')

class StatusPage extends StackedPage {

  constructor(contentFn = ContentFn) {
    super(contentFn)
    this.statusElement = new StatusElement()
  }

  bind() {
    super.bind()

    this.statusElement.bind()

    this.getContent().querySelector('#goRefresh').addEventListener('click', this._onGoRefresh = Co.wrap(this.onGoRefresh).bind(this))

  }

  unbind() {

    this.getContent().querySelector('#goRefresh').removeEventListener('click', this._onGoRefresh)

    this.statusElement.unbind()

    super.unbind()
  }

  *onGoRefresh() {
    Log.debug('- StatusPage.onGoRefresh()')

    try {
      yield this.statusElement.updateContent()
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onShown(isInitial) {
    Log.debug('- StatusPage.onShown(%s)', isInitial)

    let self = this
    let superFn = super.onShown.bind(self)

    Co(function* () {

      superFn(isInitial)

      try {
        yield self.statusElement.updateContent()
      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

}

module.exports = StatusPage
