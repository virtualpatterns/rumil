'use strict'

const Co = require('co')
const Is = require('@pwn/is')

const CountDown = require('../../count-down')
const Element = require('../../element')
const Log = require('../../log')

const IntervalError = require('../../errors/interval-error')

const ContentFn = require('./cache-element.pug')

class CacheElement extends Element {

  constructor(contentFn = ContentFn) {
    super(true, contentFn)
    this.onUpdatingIndex = 0
  }

  renderContent(data = {}) {
    // Log.debug('- CacheElement.renderContent(data)')

    data.status = data.status || {
      'isUpdating': true,
      'isDownloading': false,
      'isUpdateRequired': false
    }

    return super.renderContent(data)

  }

  bind() {
    super.bind()
  }

  unbind() {

    CountDown.stop(this, '#onUpdateReady')

    super.unbind()
  }

  onUpdating() {

    try {

      Log.debug('- CacheElement.onUpdating() this.onUpdatingIndex=%j', this.onUpdatingIndex)

      if (this.onUpdatingIndex >= 1) {

        let data = {
          'status': {
            'isUpdating': true,
            'isDownloading': false,
            'isUpdateRequired': false
          }
        }

        try {
          this.updateContent(data)
        }
        catch (error) {
          if (error instanceof IntervalError) {
            Log.warn('- CacheElement.onUpdating() this.onUpdatingIndex=%j', this.onUpdatingIndex)
            Log.warn(error)
          }
          else
            throw error
        }

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
          'isUpdating': false,
          'isDownloading': true,
          'isUpdateRequired': false
        }
      }

      try {
        this.updateContent(data)
      }
      catch (error) {
        if (error instanceof IntervalError) {
          Log.warn('- CacheElement.onDownloading()')
          Log.warn(error)
        }
        else
          throw error
      }

    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onUpdateReady() {

    let self = this

    Co(function* () {

      try {

        Log.debug('- CacheElement.onUpdateReady()')

        let data = {
          'status': {
            'isUpdating': false,
            'isDownloading': false,
            'isUpdateRequired': true
          }
        }

        try {

          self.updateContent(data)

          yield CountDown.start(self, '#onUpdateReady', 5)

        }
        catch (error) {
          if (error instanceof IntervalError) {
            Log.warn('- CacheElement.onUpdateReady()')
            Log.warn(error)
          }
          else
            throw error
        }

        window.location.reload(true)

      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

  onNoUpdate() {

    try {

      Log.debug('- CacheElement.onNoUpdate()')

      let data = {
        'status': {
          'isUpdating': false,
          'isDownloading': false,
          'isUpdateRequired': false
        }
      }

      try {
        this.updateContent(data)
      }
      catch (error) {
        if (error instanceof IntervalError) {
          Log.warn('- CacheElement.onNoUpdate()')
          Log.warn(error)
        }
        else
          throw error
      }

    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onError(event) {

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
