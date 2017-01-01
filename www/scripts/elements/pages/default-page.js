'use strict'

const Co = require('co')
const Timeout = require('timer-promise')

const CachePage = require('./cache-page')
const CountDown = require('../../count-down')
const Log = require('../../log')
const SettingsPage = require('./settings-page')
// const Spinner = require('../dialogs/spinner-dialog')
const StackedPage = require('./stacked-page')
const StatusPage = require('./status-page')
const TestPage = require('./test-page')

const IntervalError = require('../../errors/interval-error')

const ContentFn = require('./default-page.pug')

const SELECTOR = '#countDown'

class DefaultPage extends StackedPage {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

  bind() {
    super.bind()

    this.getContent().querySelector('#goStatus').addEventListener('click', this._onGoStatus = Co.wrap(this.onGoStatus).bind(this))

    if (this.getContent().querySelector('#goCache'))
      this.getContent().querySelector('#goCache').addEventListener('click', this._onGoCache = Co.wrap(this.onGoCache).bind(this))

    this.getContent().querySelector('#goSettings').addEventListener('click', this._onGoSettings = Co.wrap(this.onGoSettings).bind(this))
    this.getContent().querySelector('#goTests').addEventListener('click', this._onGoTests = this.onGoTests.bind(this))
    this.getContent().querySelector('#goCoverage').addEventListener('click', this._onGoCoverage = this.onGoCoverage.bind(this))
    this.getContent().querySelector('#goCountDown').addEventListener('click', this._onGoCountDown = Co.wrap(this.onGoCountDown).bind(this))
    this.getContent().querySelector('#goAlert').addEventListener('click', this._onGoAlert = Co.wrap(this.onGoAlert).bind(this))
    this.getContent().querySelector('#goConfirmation').addEventListener('click', this._onGoConfirmation = Co.wrap(this.onGoConfirmation).bind(this))
    // this.getContent().querySelector('#goSpinner').addEventListener('click', this._onGoSpinner = Co.wrap(this.onGoSpinner).bind(this))
    this.getContent().querySelector('#goSimple').addEventListener('click', this._onGoSimple = Co.wrap(this.onGoSimple).bind(this))
    this.getContent().querySelector('#goOAuth2').addEventListener('click', this._onGoOAuth2 = Co.wrap(this.onGoOAuth2).bind(this))
    this.getContent().querySelector('#goGitHub').addEventListener('click', this._onGoGitHub = Co.wrap(this.onGoGitHub).bind(this))
    this.getContent().querySelector('#goGoogle').addEventListener('click', this._onGoGoogle = Co.wrap(this.onGoGoogle).bind(this))
    this.getContent().querySelector('#goTwitter').addEventListener('click', this._onGoTwitter = Co.wrap(this.onGoTwitter).bind(this))

  }

  unbind() {

    this.getContent().querySelector('#goTwitter').removeEventListener('click', this._onGoTwitter)
    this.getContent().querySelector('#goGoogle').removeEventListener('click', this._onGoGoogle)
    this.getContent().querySelector('#goGitHub').removeEventListener('click', this._onGoGitHub)
    this.getContent().querySelector('#goOAuth2').removeEventListener('click', this._onGoOAuth2)
    this.getContent().querySelector('#goSimple').removeEventListener('click', this._onGoSimple)
    // this.getContent().querySelector('#goSpinner').removeEventListener('click', this._onGoSpinner)
    this.getContent().querySelector('#goConfirmation').removeEventListener('click', this._onGoConfirmation)
    this.getContent().querySelector('#goAlert').removeEventListener('click', this._onGoAlert)
    this.getContent().querySelector('#goCountDown').removeEventListener('click', this._onGoCountDown)
    this.getContent().querySelector('#goCoverage').removeEventListener('click', this._onGoCoverage)
    this.getContent().querySelector('#goTests').removeEventListener('click', this._onGoTests)
    this.getContent().querySelector('#goSettings').removeEventListener('click', this._onGoSettings)

    if (this.getContent().querySelector('#goCache'))
      this.getContent().querySelector('#goCache').removeEventListener('click', this._onGoCache)

    this.getContent().querySelector('#goStatus').removeEventListener('click', this._onGoStatus)

    super.unbind()
  }

  onHidden(isFinal) {
    Log.debug('- DefaultPage.onHidden(%j)', isFinal)
    CountDown.stop(this, '#countDown')
    super.onHidden(isFinal)
  }

  *onGoStatus() {
    Log.debug('- DefaultPage.onGoStatus()')

    try {
      yield window.application.pushPage(new StatusPage())
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  *onGoCache() {
    Log.debug('- DefaultPage.onGoCache()')

    try {
      yield window.application.pushPage(new CachePage())
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  *onGoSettings() {
    Log.debug('- DefaultPage.onGoSettings()')

    try {
      yield window.application.pushPage(new SettingsPage())
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onGoTests() {
    Log.debug('- DefaultPage.onGoTests()')

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

  *onGoCountDown() {
    Log.debug('- DefaultPage.onGoCountDown()')

    try {

      yield CountDown.start(this, SELECTOR, 10)

      document.querySelector(SELECTOR).innerHTML = '<span style=\'font-style: italic;\'>n</span>'

    }
    catch (error) {
      if (error instanceof IntervalError) {
        Log.warn('- DefaultPage.onGoCountDown()')
        Log.warn(error)
        document.querySelector(SELECTOR).innerHTML = '<span style=\'font-style: italic;\'>x</span>'
      }
      else
        window.application.showError(error)
    }

  }

  *onGoAlert() {
    Log.debug('- DefaultPage.onGoAlert()')

    try {
      yield window.application.showAlert(`Danger!`)
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  *onGoConfirmation() {
    Log.debug('- DefaultPage.onGoConfirmation()')

    try {
      let response = yield window.application.showConfirmation('Are you sure?')
      yield window.application.showAlert(`You said ... <span style="font-weight: bold;">${response ? 'Yes' : 'No'}</span>.`)
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  // *onGoSpinner() {
  //
  //   try {
  //     Log.debug('- DefaultPage.onGoSpinner()')
  //
  //     let dialog = yield window.application.showSpinner()
  //     yield Timeout.start('DefaultPage.onGoSpinner', 3000)
  //     yield window.application.hideSpinner(dialog)
  //
  //   }
  //   catch (error) {
  //     window.application.showError(error)
  //   }
  //
  // }

  *onGoSimple() {
    Log.debug('- DefaultPage.onGoSimple()')

    try {
      yield window.application.authorize('simple')
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  *onGoOAuth2() {
    Log.debug('- DefaultPage.onGoOAuth2()')

    try {
      yield window.application.authorize('oauth2')
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  *onGoGitHub() {
    Log.debug('- DefaultPage.onGoGitHub()')

    try {
      yield window.application.authorize('github')
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  *onGoGoogle() {
    Log.debug('- DefaultPage.onGoGoogle()')

    try {
      yield window.application.authorize('google', {
        'scopes': [ 'profile' ]
      })
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  *onGoTwitter() {
    Log.debug('- DefaultPage.onGoTwitter()')

    try {
      yield window.application.authorize('twitter')
    }
    catch (error) {
      window.application.showError(error)
    }

  }

}

module.exports = DefaultPage
