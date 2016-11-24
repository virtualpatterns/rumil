'use strict'

const Is = require('@pwn/is')
// const Timeout = require('timer-promise')

// const Interval = require('../../interval')
const Log = require('../../log')
const NavigatedPage = require('./navigated-page')
// const Page = require('../page')
const StatusElement = require('./status-element')

// const IntervalError = require('../../errors/interval-error')

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

    // Interval.stopBySelector(`#${this.id} #onRefreshInterval`)

    this.statusElement.unbindEvents()

    this.getContent().querySelector('#goRefresh').removeEventListener('click', this._onGoRefresh)

    super.unbindEvents()
  }

  onGoRefresh() {
    Promise.resolve()
      .then(() => {

        Log.debug('- StatusPage.onGoRefresh()')

        // Interval.stopBySelector(`#${this.id} #onRefreshInterval`)

      })
      // .then(() => window.application.showSpinner())
      .then(() => this.statusElement.updateContent())
      // .then(() => window.application.hideSpinner())
      // .then(() => Interval.startBySelector(`#${this.id} #onRefreshInterval`))
      .catch((error) => {
        // window.application.hideSpinner()
        window.application.showError(error)
      })
      // .catch((error) => {
      //
      //   if (Is.error(error)) {
      //     Log.error('- StatusPage.onGoRefresh()')
      //     Log.error(error)
      //   }
      //   else
      //     window.application.showError(error)
      //
      // })
  }

  onShown(isInitial) {
    Promise.resolve()
      .then(() => {

        super.onShown(isInitial)

        Log.debug('- StatusPage.onShown(%s)', isInitial)

      })
      // .then(() => window.application.showSpinner())
      .then(() => this.statusElement.updateContent())
      // .then(() => window.application.hideSpinner())
      .catch((error) => {
        // window.application.hideSpinner()
        window.application.showError(error)
      })
      // .catch((error) => {
      //
      //   if (Is.error(error)) {
      //     Log.error('- StatusPage.onGoRefresh()')
      //     Log.error(error)
      //   }
      //   else
      //     window.application.showError(error)
      //
      // })
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
