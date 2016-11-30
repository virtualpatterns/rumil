'use strict'

const Log = require('../../log')
const StackedPage = require('./stacked-page')
const BlinkElement = require('./blink-element')

const ContentFn = require('./blink-page.pug')

class BlinkPage extends StackedPage {

  constructor(contentFn = ContentFn) {
    super(contentFn)
    this.blinkElement = new BlinkElement()
  }

  bind() {
    super.bind()

    this.getContent().querySelector('#goRefresh').addEventListener('click', this._onGoRefresh = this.onGoRefresh.bind(this))

    this.blinkElement.bind()

  }

  unbind() {

    this.blinkElement.unbind()

    this.getContent().querySelector('#goRefresh').removeEventListener('click', this._onGoRefresh)

    super.unbind()
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
