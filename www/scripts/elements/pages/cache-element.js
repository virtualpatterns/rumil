'use strict'

const Is = require('@pwn/is')

const CountDown = require('../../count-down')
const Element = require('../../element')
const Log = require('../../log')

const IntervalError = require('../../errors/interval-error')
const CacheError = require('../../errors/cache-error')

const ContentFn = require('./cache-element.pug')

class CacheElement extends Element {

  constructor(contentFn = ContentFn) {
    super(true, contentFn)
    this.onUpdatingIndex = 0
  }

  renderContent(data = {}) {

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

      if (this.onUpdatingIndex >= 1)
        this.updateContent({
          'status': {
            'isUpdating': true,
            'isDownloading': false,
            'isUpdateRequired': false
          }
        })

      this.onUpdatingIndex++

    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onDownloading() {

    try {
      Log.debug('- CacheElement.onDownloading()')

      this.updateContent({
        'status': {
          'isUpdating': false,
          'isDownloading': true,
          'isUpdateRequired': false
        }
      })

    }
    catch (error) {
      window.application.showError(error)
    }

  }

  *onUpdateReady() {

    try {
      Log.debug('- CacheElement.onUpdateReady()')

      this.updateContent({
        'status': {
          'isUpdating': false,
          'isDownloading': false,
          'isUpdateRequired': true
        }
      })

      try {
        yield CountDown.start(this, '#onUpdateReady', 3)
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

  }

  onNoUpdate() {

    try {
      Log.debug('- CacheElement.onNoUpdate()')

      this.updateContent({
        'status': {
          'isUpdating': false,
          'isDownloading': false,
          'isUpdateRequired': false
        }
      })

    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onObsolete() {
    Log.debug('- CacheElement.onObsolete()')
    window.application.showError(new CacheError('An error occurred checking for application updates.  The application cache is obsolete.'))
  }

  onError(error) {
    Log.debug('- CacheElement.onError(error)')
    window.application.showError(error)
  }

}

module.exports = CacheElement
