'use strict'

const Co = require('co')
const _Date = require('datejs')
const Format = require('human-format')
const Request = require('axios')

const Element = require('../../element')
const Log = require('../../log')

const ContentFn = require('./status-element.pug')

class StatusElement extends Element {

  constructor(contentFn = ContentFn) {
    super(true, contentFn)
  }

  updateContent(data = {}) {

    let self = this
    let superFn = super.updateContent

    return Co(function* () {

      try {

        Log.debug('- StatusElement.updateContent(data)')

        let response = yield Request.get('/api/status')
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

        // Log.debug(status)

        data.status = status

        // super.updateContent(data)
        // Element.prototype.updateContent.call(self, data)
        superFn.call(self, data)

      }
      catch (error) {
        window.application.showError(error)
      }

    })
  }

}

module.exports = StatusElement
