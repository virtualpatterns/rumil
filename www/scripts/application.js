'use strict'

const Co = require('co')
const Timeout = require('timer-promise')
const Utilities = require('util')

const AlertDialog = require('./elements/dialogs/alert-dialog')
const ConfirmationDialog = require('./elements/dialogs/confirmation-dialog')
const Element = require('./element')
const Index = require('../../index.json')
const Log = require('./log')
const Package = require('../../package.json')
const SpinnerDialog = require('./elements/dialogs/spinner-dialog')

const ContentFn = require('./application.pug')

class Application extends Element {

  constructor(contentFn = ContentFn) {
    super(false, contentFn)
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

  bind() {
    super.bind()

    this.onEvent('ready', this._onReady = this.onReady.bind(this))
    this.onEvent('dialogShown', this._onDialogShown = this.onDialogShown.bind(this))
    this.onEvent('dialogHidden', this._onDialogHidden = this.onDialogHidden.bind(this))
    this.onEvent('authorized', this._onAuthorized = this.onAuthorized.bind(this))

  }

  unbind() {

    this.offEvent('authorized', this._onAuthorized)
    this.offEvent('dialogHidden', this._onDialogHidden)
    this.offEvent('dialogShown', this._onDialogShown)
    this.offEvent('ready', this._onReady)

    super.unbind()
  }

  onReady() {

    try {

      Log.debug('- Application.onReady() this.name=%j', this.name)
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

    let self = this

    return Co(function* () {

      Log.debug('- Application.showDialog(dialog, options)')

      dialog.addContent()

      yield Timeout.start('Application.showDialog', 0)
      yield dialog.getContent().show({
        'animation': options.animation,
        'animationOptions': options.animationOptions
      })

      self.emitDialogShown(dialog)

      return dialog

    })

  }

  hideDialog(dialog, response, options = {
    'animation': 'slide'
  }) {

    let self = this

    return Co(function* () {

      Log.debug('- Application.hideDialog(dialog, response, options)\n\n%s\n\n', Utilities.inspect(response))

      yield dialog.getContent().hide({
        'animation': options.animation,
        'animationOptions': options.animationOptions
      })

      self.emitDialogHidden(dialog, response)

      dialog.removeContent()

      return { dialog, response }

    })

  }

  whenDialog(dialog, options = {
    'animation': 'slide'
  }) {

    let self = this

    return new Promise((resolve, reject) => {

      Co(function* () {

        try {

          Log.debug('- whenDialog(dialog, options)')

          yield self.showDialog(dialog, options)

          dialog.on('hidden', (response) => {
            resolve(response)
          })

        }
        catch (error) {
          reject(error)
        }

      })

    })

  }

  showAlert(text, title = 'Alert') {
    Log.debug('- Application.showAlert(%j, %j)', text, title)
    return this.whenDialog(new AlertDialog(text, title))
  }

  showError(error) {
    Log.error('- Application.showError(error)')
    Log.error(error)
    return this.whenDialog(new AlertDialog(error.message || error, 'Error'))
  }

  showConfirmation(text, title = 'Confirm') {
    Log.debug('- Application.showConfirmation(%j, %j)', text, title)
    return this.whenDialog(new ConfirmationDialog(text, title))
  }

  showSpinner(Dialog = SpinnerDialog) {
    Log.debug('- Application.showSpinner()')
    return this.showDialog(new Dialog())
  }

  hideSpinner() {
    Log.debug('- Application.hideSpinner()')
    let element = document.querySelector('ons-dialog.rum-spinner-dialog:last-child')
    if (element)
      return this.hideDialog(element.getElement(), false)
    else
      Log.warn('- Application.hideSpinner() element=%j', element)
  }

  authorize(system, scopes = []) {
    Log.debug('- Application.authorize(%j, %j)', system, scopes)

    window.open(`./authorize/${system}${scopes.length ? `` : `?scopes=${scopes.join(',')}`}`)

    return new Promise((resolve, reject) => {
      this.on('authorized', (token) => {
        resolve(token)
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

module.exports = Application
