'use strict'

// const Page = require('../page')
const CachePage = require('./cache-page')
const Log = require('../../log')
const NavigatedPage = require('./navigated-page')
const StatusPage = require('./status-page')
const TestPage = require('./test-page')

const ContentFn = require('./default-page.pug')

class DefaultPage extends NavigatedPage {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

  bindEvents() {
    super.bindEvents()

    // this.onEvent('shown', this._onShown = this.onShown.bind(this))
    // this.onEvent('hidden', this._onHidden = this.onHidden.bind(this))

    // if (window.application.numberOfPages() > 1)
    //   this.getContent().querySelector('#goBack').addEventListener('click', this._onGoBack = this.onGoBack.bind(this))

    // if (this.getContent().querySelector('#goBack'))
    //   this.getContent().querySelector('#goBack').addEventListener('click', this._onGoBack = this.onGoBack.bind(this))

    this.getContent().querySelector('#goStatus').addEventListener('click', this._onGoStatus = this.onGoStatus.bind(this))

    if (this.getContent().querySelector('#goCache'))
      this.getContent().querySelector('#goCache').addEventListener('click', this._onGoCache = this.onGoCache.bind(this))

    this.getContent().querySelector('#goTests').addEventListener('click', this._onGoTests = this.onGoTests.bind(this))
    this.getContent().querySelector('#goCoverage').addEventListener('click', this._onGoCoverage = this.onGoCoverage.bind(this))
    this.getContent().querySelector('#goAlert').addEventListener('click', this._onGoAlert = this.onGoAlert.bind(this))
    this.getContent().querySelector('#goConfirmation').addEventListener('click', this._onGoConfirmation = this.onGoConfirmation.bind(this))

  }

  unbindEvents() {

    this.getContent().querySelector('#goConfirmation').removeEventListener('click', this._onGoConfirmation)
    this.getContent().querySelector('#goAlert').removeEventListener('click', this._onGoAlert)
    this.getContent().querySelector('#goCoverage').removeEventListener('click', this._onGoCoverage)
    this.getContent().querySelector('#goTests').removeEventListener('click', this._onGoTests)

    if (this.getContent().querySelector('#goCache'))
      this.getContent().querySelector('#goCache').removeEventListener('click', this._onGoCache)

    this.getContent().querySelector('#goStatus').removeEventListener('click', this._onGoStatus)

    // if (this.getContent().querySelector('#goBack'))
    //   this.getContent().querySelector('#goBack').removeEventListener('click', this._onGoBack)

    // if (window.application.numberOfPages() > 1)
    //   this.getContent().querySelector('#goBack').removeEventListener('click', this._onGoBack)

    // this.offEvent('hidden', this._onHidden)
    // this.offEvent('shown', this._onShown)

    super.unbindEvents()
  }

  // onGoBack() {
  //   Log.debug('- DefaultPage.onGoBack()')
  //   window.application.popPage()
  //     .catch((error) => window.application.showError(error))
  // }

  onGoStatus() {
    Log.debug('- DefaultPage.onGoStatus()')
    window.application.pushPage(new StatusPage())
      .catch((error) => window.application.showError(error))
  }

  onGoCache() {
    Log.debug('- DefaultPage.onGoCache()')
    window.application.pushPage(new CachePage())
      .catch((error) => window.application.showError(error))
  }

  onGoTests() {
    Log.debug('- DefaultPage.onGoTests()')

    // window.application.pushPage(new TestPage())
    //   .catch((error) => window.application.showError(error))

    try {
      window.open('./index.html?page=./test-page.js')
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onGoCoverage() {
    Log.debug('- DefaultPage.onGoCoverage()')

    try {
      window.open('./coverage/lcov-report/index.html')
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onGoAlert() {
    Log.debug('- DefaultPage.onGoAlert()')
    Promise.resolve()
      .then((response) => window.application.showAlert(`Danger!`))
      .catch((error) => window.application.showError(error))
  }

  onGoConfirmation() {
    Log.debug('- DefaultPage.onGoConfirmation()')
    Promise.resolve()
      .then(() => window.application.showConfirmation('Are you sure?'))
      .then((response) => window.application.showAlert(`You said ... <span style="font-weight: bold;">${response ? 'Yes' : 'No'}</span>.`))
      .catch((error) => window.application.showError(error))
  }

}

module.exports = DefaultPage
