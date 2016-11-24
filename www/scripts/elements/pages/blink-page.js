'use strict'

const Log = require('../../log')
const NavigatedPage = require('./navigated-page')
const BlinkElement = require('./blink-element')

const ContentFn = require('./blink-page.pug')

class BlinkPage extends NavigatedPage {

  constructor(contentFn = ContentFn) {
    super(contentFn)
    this.blinkElement = new BlinkElement()
  }

  bindEvents() {
    super.bindEvents()

    this.getContent().querySelector('#goRefresh').addEventListener('click', this._onGoRefresh = this.onGoRefresh.bind(this))

    this.blinkElement.bindEvents()

  }

  unbindEvents() {

    this.blinkElement.unbindEvents()

    this.getContent().querySelector('#goRefresh').removeEventListener('click', this._onGoRefresh)

    super.unbindEvents()
  }

  onGoRefresh() {

    try {
      Log.debug('- BlinkPage.onGoRefresh()')

      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()

    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onShown(isInitial) {

    try {
      super.onShown(isInitial)
      Log.debug('- BlinkPage.onShown(%s)', isInitial)

      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()
      this.blinkElement.updateContent()

    }
    catch (error) {
      window.application.showError(error)
    }

  }

}

module.exports = BlinkPage
