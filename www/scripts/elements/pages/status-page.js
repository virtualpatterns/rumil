'use strict'

const Is = require('@pwn/is')
const Timeout = require('timer-promise')

// const Page = require('../page')
const Log = require('../../log')
const NavigatedPage = require('./navigated-page')
const StatusElement = require('./status-element')

const ContentFn = require('./status-page.pug')

class StatusPage extends NavigatedPage {

  constructor(contentFn = ContentFn) {
    super(contentFn)
    this.statusElement = new StatusElement()
  }

  bindEvents() {
    super.bindEvents()

    this.getContent().querySelector('#goRefresh').addEventListener('click', this._onGoRefresh = this.onGoRefresh.bind(this))

    this.statusElement.bindEvents()

  }

  unbindEvents() {

    this.statusElement.unbindEvents()

    this.getContent().querySelector('#goRefresh').removeEventListener('click', this._onGoRefresh)

    super.unbindEvents()
  }

  onGoRefresh() {
    Log.debug('- StatusPage.onGoRefresh()')

    Promise.resolve()
      .then(() => this.statusElement.updateContent())
      .catch((error) => window.application.showError(error))

  }

  onShown(isInitial) {
    super.onShown(isInitial)

    Log.debug('- StatusPage.onShown(%s)', isInitial)

    Promise.resolve()
      .then(() => this.statusElement.updateContent())
      .catch((error) => window.application.showError(error))

  }

  // onHidden(isFinal) {
  //   super.onHidden(isFinal)
  //
  //   Log.debug('- StatusPage.onHidden(%s)', isFinal)
  //
  //   Timeout.clear('Status.updateContent')
  //
  // }

}

module.exports = StatusPage
