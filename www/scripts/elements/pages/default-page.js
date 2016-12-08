'use strict'

const Co = require('co')
const Timeout = require('timer-promise')

// const BlinkPage = require('./blink-page')
const CachePage = require('./cache-page')
const CountDown = require('../../count-down')
const GitHubPage = require('./github-page')
const GooglePage = require('./google-page')
const Log = require('../../log')
const Spinner = require('../dialogs/spinner-dialog')
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

    // this.getContent().querySelector('#goPop').addEventListener('click', this._onGoPop = this.onGoPop.bind(this))
    this.getContent().querySelector('#goStatus').addEventListener('click', this._onGoStatus = this.onGoStatus.bind(this))

    if (this.getContent().querySelector('#goCache'))
      this.getContent().querySelector('#goCache').addEventListener('click', this._onGoCache = this.onGoCache.bind(this))

    this.getContent().querySelector('#goTests').addEventListener('click', this._onGoTests = this.onGoTests.bind(this))
    this.getContent().querySelector('#goCoverage').addEventListener('click', this._onGoCoverage = this.onGoCoverage.bind(this))
    this.getContent().querySelector('#goCountDown').addEventListener('click', this._onGoCountDown = this.onGoCountDown.bind(this))
    // this.getContent().querySelector('#goBlink').addEventListener('click', this._onGoBlink = this.onGoBlink.bind(this))
    this.getContent().querySelector('#goAlert').addEventListener('click', this._onGoAlert = this.onGoAlert.bind(this))
    this.getContent().querySelector('#goConfirmation').addEventListener('click', this._onGoConfirmation = this.onGoConfirmation.bind(this))
    this.getContent().querySelector('#goSpinner').addEventListener('click', this._onGoSpinner = this.onGoSpinner.bind(this))
    this.getContent().querySelector('#goSimple').addEventListener('click', this._onGoSimple = this.onGoSimple.bind(this))
    this.getContent().querySelector('#goGitHub').addEventListener('click', this._onGoGitHub = this.onGoGitHub.bind(this))
    this.getContent().querySelector('#goGoogle').addEventListener('click', this._onGoGoogle = this.onGoGoogle.bind(this))
    this.getContent().querySelector('#goTwitter').addEventListener('click', this._onGoTwitter = this.onGoTwitter.bind(this))

  }

  unbind() {

    this.getContent().querySelector('#goTwitter').removeEventListener('click', this._onGoTwitter)
    this.getContent().querySelector('#goGoogle').removeEventListener('click', this._onGoGoogle)
    this.getContent().querySelector('#goGitHub').removeEventListener('click', this._onGoGitHub)
    this.getContent().querySelector('#goSimple').removeEventListener('click', this._onGoSimple)
    this.getContent().querySelector('#goSpinner').removeEventListener('click', this._onGoSpinner)
    this.getContent().querySelector('#goConfirmation').removeEventListener('click', this._onGoConfirmation)
    this.getContent().querySelector('#goAlert').removeEventListener('click', this._onGoAlert)
    // this.getContent().querySelector('#goBlink').removeEventListener('click', this._onGoBlink)
    this.getContent().querySelector('#goCountDown').removeEventListener('click', this._onGoCountDown)
    this.getContent().querySelector('#goCoverage').removeEventListener('click', this._onGoCoverage)
    this.getContent().querySelector('#goTests').removeEventListener('click', this._onGoTests)

    if (this.getContent().querySelector('#goCache'))
      this.getContent().querySelector('#goCache').removeEventListener('click', this._onGoCache)

    this.getContent().querySelector('#goStatus').removeEventListener('click', this._onGoStatus)
    // this.getContent().querySelector('#goPop').removeEventListener('click', this._onGoPop)

    super.unbind()
  }

  onHidden() {
    Log.debug('- DefaultPage.onHidden()')
    CountDown.stop(this, '#countDown')
    super.onHidden()
  }

  // onGoPop() {
  //
  //   Co(function* () {
  //
  //     try {
  //       Log.debug('- DefaultPage.onGoPop()')
  //       yield window.application.popPage()
  //     }
  //     catch (error) {
  //       window.application.showError(error)
  //     }
  //
  //   })
  //
  // }

  onGoStatus() {

    Co(function* () {

      try {
        Log.debug('- DefaultPage.onGoStatus()')
        yield window.application.pushPage(new StatusPage())
      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

  onGoCache() {

    Co(function* () {

      try {
        Log.debug('- DefaultPage.onGoCache()')
        window.application.pushPage(new CachePage())
      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

  onGoTests() {

    try {
      Log.debug('- DefaultPage.onGoTests()')
      window.open('./index.html?page=./test-page.js')
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onGoCoverage() {

    try {
      Log.debug('- DefaultPage.onGoCoverage()')
      window.open('./coverage/lcov-report/index.html')
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onGoCountDown() {

    let self = this

    Co(function* () {

      try {

        Log.debug('- DefaultPage.onGoCountDown()')

        yield CountDown.start(self, SELECTOR, 10)

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

    })

  }

  // onGoBlink() {
  //   Log.debug('- DefaultPage.onGoBlink()')
  //   window.application.pushPage(new BlinkPage())
  //     .catch((error) => window.application.showError(error))
  // }

  onGoAlert() {

    Co(function* () {

      try {
        Log.debug('- DefaultPage.onGoAlert()')
        yield window.application.showAlert(`Danger!`)
      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

  onGoConfirmation() {

    Co(function* () {

      try {
        Log.debug('- DefaultPage.onGoConfirmation()')
        let response = yield window.application.showConfirmation('Are you sure?')
        yield window.application.showAlert(`You said ... <span style="font-weight: bold;">${response ? 'Yes' : 'No'}</span>.`)
      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

  onGoSpinner() {

    Co(function* () {

      try {
        Log.debug('- DefaultPage.onGoSpinner()')

        let dialog = yield window.application.showSpinner()
        yield Timeout.start('DefaultPage.onGoSpinner', 3000)
        yield window.application.hideSpinner(dialog)

      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

  onGoSimple() {

    Co(function* () {

      try {
        Log.debug('- DefaultPage.onGoSimple()')
        // yield window.application.authorize('Simple')
        yield window.application.authorize('OAuth2')
      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

  onGoGitHub() {

    Co(function* () {

      try {
        Log.debug('- DefaultPage.onGoGitHub()')
        // yield window.application.pushPage(new GitHubPage(yield window.application.authorize('GitHub')))
        yield window.application.authorize('GitHub')
      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

  onGoGoogle() {

    Co(function* () {

      try {
        Log.debug('- DefaultPage.onGoGoogle()')
        // yield window.application.pushPage(new GooglePage(yield window.application.authorize('Google', [
        //   'profile'
        // ])))
        yield window.application.authorize('Google')
      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

  onGoTwitter() {

    Co(function* () {

      try {
        Log.debug('- DefaultPage.onGoTwitter()')
        yield window.application.authorize('Twitter')
      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

}

module.exports = DefaultPage
