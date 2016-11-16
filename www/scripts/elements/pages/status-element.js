'use strict'

const _Date = require('datejs')
const Format = require('human-format')
const Request = require('axios')
const Timeout = require('timer-promise')

const Element = require('../../element')
const Log = require('../../log')

const ContentFn = require('./status-element.pug')

class StatusElement extends Element {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

  unbindEvents() {
    Timeout.stop('StatusElement.updateContent')
    super.unbindEvents()
  }

  renderContent(data = {}) {
    Log.debug('- StatusElement.renderContent(data)')
    data.status = data.status || {
      'isRefreshRequired': true
    }
    return super.renderContent(data)
  }

  updateContent(data = {}) {
    Log.debug('- StatusElement.updateContent(data)')

    return Promise.resolve()
      .then(() => Request.get('/api/status'))
      .then((response) => {

        let status = response.data

        status.nowAsDate = Date.parse(status.now)
        status.nowAsDateString = status.nowAsDate.toString('MMM d, yyyy')
        status.nowAsTimeString = status.nowAsDate.toString('h:mm tt')

        Log.debug('- StatusElement.updateContent(data) status.cacheTimestamp=%j', status.cacheTimestamp)
        Log.debug('- StatusElement.updateContent(data) window.application.cacheTimestamp=%j', window.application.cacheTimestamp)

        status.isRefreshRequired = false
        status.isUpdateRequired = window.application.cacheTimestamp != status.cacheTimestamp

        status.heap.totalAsString = Format(status.heap.total, {
         scale: 'binary',
         unit: 'B'
        })
        status.heap.usedAsString = Format(status.heap.used, {
         scale: 'binary',
         unit: 'B'
        })

        data.status = status

        if (this.getContent()) {
          super.updateContent(data)
          return Promise.resolve(true)
        }
        else
          return Promise.resolve(false)

      })
      .then((reUpdateContent) => {
        if (reUpdateContent)
          return Timeout.start('StatusElement.updateContent', 61000)
            .then(() => this.updateContent(data))
            .catch((error) => window.application.showError(error))
        else
          return Promise.resolve()
      })

  }

}

module.exports = StatusElement
