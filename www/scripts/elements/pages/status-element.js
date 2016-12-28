'use strict'

// const Co = require('co')
const _Date = require('datejs')
const Format = require('human-format')
// const Is = require('@pwn/is')
const Request = require('axios')

const Element = require('../../element')
const Log = require('../../log')

const ContentFn = require('./status-element.pug')

const RequestCancellation = Request.CancelToken

class StatusElement extends Element {

  constructor(contentFn = ContentFn) {
    super(true, contentFn)
    this.updateContentCancellation = null
  }

  renderContent(data = {}) {
    // Log.debug('- StatusElement.renderContent(data)')

    data.status = data.status || {}

    return super.renderContent(data)

  }

  *updateContent(data = {}) {
    Log.debug('- StatusElement.updateContent(data)')

    try {

      self.updateContentCancellation = RequestCancellation.source()

      let response = yield Request.get('/api/status', {
        cancelToken: self.updateContentCancellation.token
      })

      self.updateContentCancellation = null

      let status = response.data

      // Log.debug(status)

      status.nowAsDate = Date.parse(status.now)
      status.nowAsDateString = status.nowAsDate.toString('MMM d, yyyy')
      status.nowAsTimeString = status.nowAsDate.toString('h:mm tt')

      status.isUpdateRequired = window.application.version != status.version

      status.heap.totalAsString = Format(status.heap.total, {
       scale: 'binary',
       unit: 'B'
      })

      status.heap.usedAsString = Format(status.heap.used, {
       scale: 'binary',
       unit: 'B'
      })

      Log.debug(status)

      super.updateContent({
        'status': status
      })

    }
    catch (error) {
      if (Request.isCancel(error)) {
        Log.warn('- StatusElement.updateContent(data)')
        Log.warn('-   error.message=%j', error.message)
      }
      else
        window.application.showError(error)
    }

  }

  bind() {
    super.bind()
  }

  unbind() {

    if (this.updateContentCancellation)
      this.updateContentCancellation.cancel('Cancelling StatusElement.updateContent(data) ...')

    super.unbind()
  }

}

module.exports = StatusElement
