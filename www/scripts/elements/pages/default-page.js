'use strict'

const Is = require('@pwn/is')
const Timeout = require('timer-promise')
const Utilities = require('util')

// const Page = require('../page')
const BlinkPage = require('./blink-page')
const CachePage = require('./cache-page')
const GitHubPage = require('./github-page')
const Interval = require('../../interval')
const Log = require('../../log')
const NavigatedPage = require('./navigated-page')
const StatusPage = require('./status-page')
const TestPage = require('./test-page')

const IntervalError = require('../../errors/interval-error')

const ContentFn = require('./default-page.pug')

class DefaultPage extends NavigatedPage {

  constructor(contentFn = ContentFn) {
    super(contentFn)
    this.selector = `#${this.id} #goIntervalInterval`
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
    this.getContent().querySelector('#goInterval').addEventListener('click', this._onGoInterval = this.onGoInterval.bind(this))
    this.getContent().querySelector('#goBlink').addEventListener('click', this._onGoBlink = this.onGoBlink.bind(this))
    this.getContent().querySelector('#goAlert').addEventListener('click', this._onGoAlert = this.onGoAlert.bind(this))
    this.getContent().querySelector('#goConfirmation').addEventListener('click', this._onGoConfirmation = this.onGoConfirmation.bind(this))
    this.getContent().querySelector('#goSpinner').addEventListener('click', this._onGoSpinner = this.onGoSpinner.bind(this))
    this.getContent().querySelector('#goGitHub').addEventListener('click', this._onGoGitHub = this.onGoGitHub.bind(this))

  }

  unbindEvents() {

    this.getContent().querySelector('#goGitHub').removeEventListener('click', this._onGoGitHub)
    this.getContent().querySelector('#goSpinner').removeEventListener('click', this._onGoSpinner)
    this.getContent().querySelector('#goConfirmation').removeEventListener('click', this._onGoConfirmation)
    this.getContent().querySelector('#goAlert').removeEventListener('click', this._onGoAlert)
    this.getContent().querySelector('#goBlink').removeEventListener('click', this._onGoBlink)
    this.getContent().querySelector('#goInterval').removeEventListener('click', this._onGoInterval)
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

  onHidden() {
    Log.debug('- DefaultPage.onHidden()')
    Interval.stopBySelector(this.selector)
    super.onHidden()
  }

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

  onGoInterval() {
    Log.debug('- DefaultPage.onGoInterval()')

    Interval.stopBySelector(this.selector)

    Interval.startBySelector(this.selector)
      .then(() => {
        document.querySelector(this.selector).innerHTML = '<span style=\'font-style: italic;\'>n</span>'
      })
      .catch((error) => {

        if (Is.error(error))
          document.querySelector(this.selector).innerHTML = '<span style=\'font-style: italic;\'>x</span>'

        Log.error('- DefaultPage.onGoInterval()')
        Log.error(error)

      })

  }

  onGoBlink() {
    Log.debug('- DefaultPage.onGoBlink()')
    window.application.pushPage(new BlinkPage())
      .catch((error) => window.application.showError(error))
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

  onGoSpinner() {
    Log.debug('- DefaultPage.onGoSpinner()')
    Promise.resolve()
      .then(() => window.application.showSpinner())
      .then(() => Timeout.start('DefaultPage.onGoSpinner', 5000))
      .then(() => window.application.hideSpinner())
      .catch((error) => window.application.showError(error))
  }

  onGoGitHub() {
    Log.debug('- DefaultPage.onGoGitHub()')

    Promise.resolve()
      .then(() => window.application.authorize('GitHub'))
      // .then((token) => {
      //   return Timeout.start('DefaultPage.onGoGitHub', 5)
      //     .then(() => Promise.resolve(token))
      // })
      .then((token) => window.application.pushPage(new GitHubPage(token)))
      .catch((error) => window.application.showError(error))

    // let doIt = function() {
    //   Log.debug('- window.open(\'./authorize/GitHub\')')
    //   window.open('./authorize/GitHub')
    // }
    //
    // doIt()

    // Promise.resolve()
    //   // .then(() => {
    //   //   Log.debug('- window.open(\'./authorize/GitHub\')')
    //   //   window.open('./authorize/GitHub')
    //   // })
    //   .then(() => window.application.authorize('GitHub'))
    //   .catch((error) => window.application.showError(error))

    // window.application.authorize('GitHub')

  }

}

module.exports = DefaultPage

// curl -H "Authorization: token 67a2977e306d8693af89c07303dcd91e985fc557" https://api.github.com/users/technoweenie -I
