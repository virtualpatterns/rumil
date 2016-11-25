'use strict'

const Is = require('@pwn/is')
// const Timeout = require('timer-promise')

const Blink = require('../blink')
// const Element = require('../../element')
// const Interval = require('../../interval')
const Log = require('../../log')

const IntervalError = require('../../errors/interval-error')

const ContentFn = require('./cache-element.pug')

// class CacheElement extends Element {
class CacheElement extends Blink {

  constructor(contentFn = ContentFn) {
    // super(true, contentFn)
    super(contentFn)
    this.onUpdatingIndex = 0
  }

  renderContent(data = {}) {
    // Log.debug('- CacheElement.renderContent(data)')
    data.status = data.status || {
      // 'isEventUndefined': true
      // 'isEventUndefined': false,
      'isUpdating': true,
      'isDownloading': false,
      'isUpdateRequired': false
      // ,
      // 'isError': false
    }
    return super.renderContent(data)
  }

  bindEvents() {
    super.bindEvents()
  }

  unbindEvents() {

    // this.stopInterval('#onUpdateReady')
    this.stopInterval('#onUpdateReady')
    // this.stopInterval('#onNoUpdate')
    // Timeout.stop('CacheElement.onNoUpdate')

    super.unbindEvents()
  }

  onUpdating() {

    try {

      Log.debug('- CacheElement.onUpdating() this.onUpdatingIndex=%j', this.onUpdatingIndex)

      if (this.onUpdatingIndex >= 1) {

        let data = {
          'status': {
            // 'isEventUndefined': false,
            'isUpdating': true,
            'isDownloading': true,
            'isUpdateRequired': false
            // ,
            // 'isError': false
          }
        }

        // this.stopInterval('#onUpdateReady')
        // this.stopInterval('#onNoUpdate')
        // Timeout.stop('CacheElement.onNoUpdate')

        this.updateContent(data)
          .catch((error) => {
            Log.error('- CacheElement.onUpdating() this.onUpdatingIndex=%j', this.onUpdatingIndex)
            Log.error(error)
          })

      }

      this.onUpdatingIndex++

    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onDownloading() {

    try {

      Log.debug('- CacheElement.onDownloading()')

      let data = {
        'status': {
          // 'isEventUndefined': false,
          'isUpdating': false,
          'isDownloading': true,
          'isUpdateRequired': false
          // ,
          // 'isError': false
        }
      }

      // this.stopInterval('#onUpdateReady')
      // this.stopInterval('#onNoUpdate')
      // Timeout.stop('CacheElement.onNoUpdate')

      this.updateContent(data)
          .catch((error) => {
            Log.debug('- CacheElement.onDownloading()')
            Log.error(error)
          })

    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onUpdateReady() {
    Promise.resolve()
      .then(() => {

        Log.debug('- CacheElement.onUpdateReady()')

        let data = {
          'status': {
            // 'isEventUndefined': false,
            'isUpdating': false,
            'isDownloading': false,
            'isUpdateRequired': true
            // ,
            // 'isError': false
          }
        }

        // this.stopInterval('#onUpdateReady')
        // this.stopInterval('#onNoUpdate')
        // Timeout.stop('CacheElement.onNoUpdate')

        return this.updateContent(data)

      })
      .then(() => this.startInterval('#onUpdateReady', 3))
      .then(() => window.location.reload(true))
      .catch((error) => {

        if (Is.error(error)) {
          Log.error('- CacheElement.onUpdateReady()')
          Log.error(error)
        }
        else
          window.application.showError(error)

      })
  }

  onNoUpdate() {
    // Promise.resolve()
    //   .then(() => {

      try {

        Log.debug('- CacheElement.onNoUpdate()')

        let data = {
          'status': {
            // 'isEventUndefined': false,
            'isUpdating': false,
            'isDownloading': false,
            'isUpdateRequired': false
            // ,
            // 'isError': false
          }
        }

        // this.stopInterval('#onUpdateReady')
        // this.stopInterval('#onNoUpdate')
        // Timeout.stop('CacheElement.onNoUpdate')

        this.updateContent(data)
          .catch((error) => {
            Log.error('- CacheElement.onNoUpdate()')
            Log.error(error)
          })

      }
      catch (error) {
        window.application.showError(error)
      }
      // })
      // .then(() => this.startInterval('#onNoUpdate', 60))
      // // .then(() => Timeout.start('CacheElement.onNoUpdate', 60000))
      // .then(() => window.applicationCache.update())
      // .catch((error) => {
      //
      //   if (Is.error(error)) {
      //     Log.error('- CacheElement.onUpdateReady()')
      //     Log.error(error)
      //   }
      //   else
      //     window.application.showError(error)
      //
      // })
  }

  onError(event) {

    // Promise.resolve()
    //   .then(() => Log.debug('- CacheElement.onError(event)'))
    //   .then(() => window.application.showError(event))
    //   .catch((error) => window.application.showError(error))

    try {
      Log.debug('- CacheElement.onError(event)')
      window.application.showError(event)
    }
    catch (error) {
      window.application.showError(error)
    }

  }

}

module.exports = CacheElement
