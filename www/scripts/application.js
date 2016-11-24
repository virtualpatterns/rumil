'use strict'

const Emitter = require('event-emitter')
const Timeout = require('timer-promise')
const Utilities = require('util')

const AlertDialog = require('./elements/dialogs/alert-dialog')
const Automate = require('./automate')
const ConfirmationDialog = require('./elements/dialogs/confirmation-dialog')
const Element = require('./element')
const Index = require('../../index.json')
const Log = require('./log')
const Package = require('../../package.json')
const Select = require('./select')
const SpinnerDialog = require('./elements/dialogs/spinner-dialog')

const ContentFn = require('./application.pug')

class Application extends Element {

  constructor(contentFn = ContentFn) {
    super(false, contentFn)
    // this.countDowns = {}
    this.name = `${Package.name} v${Package.version}-${Index.value}`
    this.version = `${Package.version}-${Index.value}`
  }

  emitReady() {
    // Log.debug('- Application.emitReady()')
    this.emitEvent('ready')
  }

  emitDialogShown(dialog) {
    // Log.debug('- Application.emitDialogShown(dialog) dialog.id=%j', dialog.id)
    this.emitEvent('dialogShown', dialog)
  }

  emitDialogHidden(dialog, response) {
    // Log.debug('- Application.emitDialogHidden(dialog) dialog.id=%j', dialog.id)
    this.emitEvent('dialogHidden', dialog, response)
  }

  emitAuthorized(token) {
    // Log.debug('- Application.emitAuthorized(token)\n\n%s\n', Utilities.inspect(token))
    this.emitEvent('authorized', token)
  }

  bindEvents() {
    super.bindEvents()

    this.onEvent('ready', this._onReady = this.onReady.bind(this))
    this.onEvent('dialogShown', this._onDialogShown = this.onDialogShown.bind(this))
    this.onEvent('dialogHidden', this._onDialogHidden = this.onDialogHidden.bind(this))
    this.onEvent('authorized', this._onAuthorized = this.onAuthorized.bind(this))

  }

  unbindEvents() {

    this.offEvent('authorized', this._onAuthorized)
    this.offEvent('dialogHidden', this._onDialogHidden)
    this.offEvent('dialogShown', this._onDialogShown)
    this.offEvent('ready', this._onReady)

    super.unbindEvents()
  }

  onReady() {

    try {

      Log.debug('- Application.onReady()')
      Log.debug('-   window.applicationCache.status=%j', window.applicationCache.status)
      Log.debug('-   window.applicationCache.UNCACHED=%j', window.applicationCache.UNCACHED)
      Log.debug('-   window.applicationCache.IDLE=%j', window.applicationCache.IDLE)
      Log.debug('-   window.applicationCache.CHECKING=%j', window.applicationCache.CHECKING)
      Log.debug('-   window.applicationCache.DOWNLOADING=%j', window.applicationCache.DOWNLOADING)
      Log.debug('-   window.applicationCache.UPDATEREADY=%j', window.applicationCache.UPDATEREADY)
      Log.debug('-   window.applicationCache.OBSOLETE=%j', window.applicationCache.OBSOLETE)

      // UNCACHED ... A special value that indicates that an application cache object is not fully initialized.
      // IDLE ... The application cache is not currently in the process of being updated.
      // CHECKING ... The manifest is being fetched and checked for updates.
      // DOWNLOADING ... Resources are being downloaded to be added to the cache, due to a changed resource manifest.
      // UPDATEREADY ... There is a new version of the application cache available. There is a corresponding updateready event, which is fired instead of the cached event when a new update has been downloaded but not yet activated using the swapCache() method.
      // OBSOLETE ... The application cache group is now obsolete.

      this.cacheTimestamp = CACHE_TIMESTAMP

      switch (window.applicationCache.status) {
          case window.applicationCache.UNCACHED:
              this.isCacheEnabled = false
              break
          case window.applicationCache.IDLE:
          case window.applicationCache.CHECKING:
          case window.applicationCache.DOWNLOADING:
          case window.applicationCache.UPDATEREADY:
          case window.applicationCache.OBSOLETE:
              this.isCacheEnabled = true
              break
          default:
              this.isCacheEnabled = false
      }

      Log.debug('-   this.cacheTimestamp=%j', this.cacheTimestamp)
      Log.debug('-   this.isCacheEnabled=%j', this.isCacheEnabled)

      document.title = this.name

    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onDialogShown(dialog) {
    // Log.debug('- Application.onDialogShown(dialog) dialog.id=%j', dialog.id)
    dialog.emitShown()
  }

  onDialogHidden(dialog, response) {
    // Log.debug('- Application.onDialogHidden(dialog) dialog.id=%j', dialog.id)
    dialog.emitHidden(response)
  }

  onAuthorized(token) {
    Log.debug('- Application.onAuthorized(token)\n\n%s\n\n', Utilities.inspect(token))
  }

  showDialog(dialog, options = {
    'animation': 'slide'
  }) {
    // Log.debug('- Application.showDialog(dialog, options)\n%s\n\n', dialog.renderContent())
    Log.debug('- Application.showDialog(dialog, options)')

    dialog.addContent()

    return Promise.resolve()
      .then(() => Timeout.start('Application.showDialog', 0))
      .then(() => dialog.getContent().show({
        'animation': options.animation,
        'animationOptions': options.animationOptions
      }))
      .then(() => {

        this.emitDialogShown(dialog)

        return Promise.resolve(dialog)

      })
      // .catch((error) => Promise.reject(error))

  }

  hideDialog(dialog, response, options = {
    'animation': 'slide'
  }) {
    Log.debug('- Application.hideDialog(dialog, response, options)\n\n%s\n\n', Utilities.inspect(response))

    return dialog.getContent().hide({
      'animation': options.animation,
      'animationOptions': options.animationOptions
    })
      .then(() => {

        this.emitDialogHidden(dialog, response)

        dialog.removeContent()

        return Promise.resolve(dialog, response)

      })
      // .catch((error) => Promise.reject(error))

  }

  showAlert(text, title = 'Alert') {
    Log.debug('- Application.showAlert(%j, %j)', text, title)

    return Promise.resolve()
      .then(() => this.showDialog(new AlertDialog(text, title)))
      .then((dialog) => {

        return new Promise((resolve, reject) => {
          // Log.debug('> dialog.on(\'hidden\', () => { ... })')
          dialog.on('hidden', () => {
            // Log.debug('< dialog.on(\'hidden\', () => { ... })')
            resolve()
          })
        })

      })

  }

  showError(error) {
    Log.error('- Application.showError(error)')
    Log.error(error)
    return this.showAlert(error.message, 'Error')
  }

  showConfirmation(text, title = 'Confirm') {
    Log.debug('- Application.showConfirmation(%j, %j)', text, title)

    return Promise.resolve()
      .then(() => this.showDialog(new ConfirmationDialog(text, title)))
      .then((dialog) => {

        return new Promise((resolve, reject) => {
          // Log.debug('> dialog.on(\'hidden\', (response) => { ... })')
          dialog.on('hidden', (response) => {
            // Log.debug('< dialog.on(\'hidden\', (response) => { ... })')
            resolve(response)
          })
        })

      })

  }

  showSpinner(Dialog = SpinnerDialog) {
    Log.debug('- Application.showSpinner()')
    this.showDialog(new Dialog())
  }

  hideSpinner() {
    Log.debug('- Application.hideSpinner()')
    let element = document.querySelector('ons-dialog.rum-spinner-dialog:last-child')
    if (element)
      this.hideDialog(element.getElement(), false)
    else
      Log.debug('- Application.hideSpinner() element=%j', element)
  }

  authorize(system, scopes = []) {
    Log.debug('- Application.authorize(%j, %j)', system, scopes)

    // return Promise.resolve()
    //   .then(() => Promise.resolve(scopes.length == 0 ? `./authorize/${system}` : `./authorize/${system}?scopes=${scopes.join(',')}`))
    //   .then((authorizeUri) => {
    //     Log.debug('> window.open(%j)', authorizeUri)
    //     window.open(authorizeUri)
    //   })
    //   .then(() => {
    //
    //     return new Promise((resolve, reject) => {
    //       // Log.debug('> this.on(\'authorized\', (token) => { ... })')
    //       this.on('authorized', (token) => {
    //         // Log.debug('< this.on(\'authorized\', (token) => { ... })\n\n%s\n\n', Utilities.inspect(token))
    //         resolve(token)
    //       })
    //     })
    //
    //   })

    window.open(`./authorize/${system}${scopes.length ? `` : `?scopes=${scopes.join(',')}`}`)

    return new Promise((resolve, reject) => {
      this.on('authorized', (token) => {
        resolve(token)
      })
    })

  }

  // startCountDown(selector, from = 30, every = 1000, decrement = 1) {
  //   Log.debug('- Application.startCountDown(%j, %j, %j, %j)', selector, from, every, decrement)
  //
  //   return new Promise((resolve, reject) => {
  //
  //     let countDown = (this.countDowns[selector] = {})
  //
  //     countDown.index = from
  //     countDown.interval = window.setInterval(() => {
  //       Log.debug('- Application.startCountDown(%j, %j, %j, %j) countDown.index=%j', selector, from, every, decrement, countDown.index)
  //
  //       countDown.index -= decrement
  //
  //       let element = document.querySelector(selector)
  //       if (element)
  //         element.innerHTML = countDown.index
  //       else
  //         Log.debug('- Application.startCountDown(%j, %j, %j, %j) element=%j', selector, from, every, decrement, element)
  //
  //       if (countDown.index <= 0) {
  //         this.stopCountDown(selector)
  //         resolve()
  //       }
  //
  //     }, every)
  //
  //   })
  //
  // }
  //
  // stopCountDown(selector) {
  //   Log.debug('- Application.stopCountDown(%j)', selector)
  //
  //   let countDown = this.countDowns[selector]
  //
  //   if (countDown) {
  //     window.clearInterval(countDown.interval)
  //     delete this.countDowns[selector]
  //   }
  //
  // }

  noop(event) {
    Log.debug('- Application.noop(event)')

    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    return false

  }

}

Application.Automate = Automate
Application.Select = Select

module.exports = Application
