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

        this.updateContent(data)

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

      this.updateContent(data)

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

        self.updateContent(data)

        try {
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

      this.updateContent(data)

    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onError(error) {
    Log.debug('- CacheElement.onError(error)')
    window.application.showError(error)
  }

}

module.exports = CacheElement
