'use strict'

const Emitter = require('event-emitter')
const Timeout = require('timer-promise')
const Utilities = require('util')

const AlertDialog = require('./elements/dialogs/alert-dialog')
const Automation = require('./automation')
const ConfirmationDialog = require('./elements/dialogs/confirmation-dialog')
const Element = require('./element')
const Log = require('./log')
const Package = require('../../package.json')
const Selection = require('./selection')

const ContentFn = require('./application.pug')

class Application extends Element {

  constructor(contentFn = ContentFn) {
    super(contentFn)
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

  bindEvents() {
    super.bindEvents()

    this.onEvent('ready', this._onReady = this.onReady.bind(this))
    this.onEvent('dialogShown', this._onDialogShown = this.onDialogShown.bind(this))
    this.onEvent('dialogHidden', this._onDialogHidden = this.onDialogHidden.bind(this))

  }

  unbindEvents() {

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
      Log.debug('-   window.applicationCache.UPDATEREADY=%j', window.applicationCache.UPDATEREADY)
      Log.debug('-   window.applicationCache.OBSOLETE=%j', window.applicationCache.OBSOLETE)

      this.cacheTimestamp = CACHE_TIMESTAMP

      switch (window.applicationCache.status) {
          case window.applicationCache.UNCACHED:
              this.isCacheEnabled = false
              break
          case window.applicationCache.IDLE:
          case window.applicationCache.UPDATEREADY:
          case window.applicationCache.OBSOLETE:
              this.isCacheEnabled = true
              break
          default:
              this.isCacheEnabled = false
      }

      Log.debug('-   this.cacheTimestamp=%j', this.cacheTimestamp)
      Log.debug('-   this.isCacheEnabled=%j', this.isCacheEnabled)

      document.title = `${Package.name} v${Package.version}`

    }
    catch (error) {
      Log.error('- Application.onReady()')
      Log.error(error)
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
          // Log.debug('> Emitter(dialog).on(\'hidden\', () => { ... })')
          Emitter(dialog).on('hidden', () => {
            // Log.debug('- Emitter(dialog).on(\'hidden\', () => { ... })')
            resolve()
          })
        })

      })

  }

  showError(error) {
    Log.error('- Application.showError(%j)\n\n%s\n\n', error.message, error.stack)
    return this.showAlert(error.message, 'Error')
  }

  showConfirmation(text, title = 'Confirm') {
    Log.debug('- Application.showConfirmation(%j, %j)', text, title)

    return Promise.resolve()
      .then(() => this.showDialog(new ConfirmationDialog(text, title)))
      .then((dialog) => {

        return new Promise((resolve, reject) => {
          // Log.debug('> Emitter(dialog).on(\'hidden\', (response) => { ... })')
          Emitter(dialog).on('hidden', (response) => {
            // Log.debug('- Emitter(dialog).on(\'hidden\', (response) => { ... })')
            resolve(response)
          })
        })

      })

  }

  noop(event) {
    Log.debug('- Application.noop(event)')

    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    return false

  }

}

Application.Automation = Automation
Application.Selection = Selection

module.exports = Application
