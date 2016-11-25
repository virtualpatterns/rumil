'use strict'

const _Date = require('datejs')
const Format = require('human-format')
const Is = require('@pwn/is')
const Request = require('axios')
// const Timeout = require('timer-promise')

// const Element = require('../../element')
const Blink = require('../blink')
// const Interval = require('../../interval')
const Log = require('../../log')

const IntervalError = require('../../errors/interval-error')

const ContentFn = require('./status-element.pug')

class StatusElement extends Blink {
// class StatusElement extends Element {

  constructor(contentFn = ContentFn) {
    // super(true, contentFn)
    super(contentFn)
  }

  renderContent(data = {}) {
    // Log.debug('- StatusElement.renderContent(data)')
    data.status = data.status || {
      'isRefreshRequired': true
    }
    return super.renderContent(data)
  }

  updateContent(data = {}) {

    return Promise.resolve()
      .then(() => Log.debug('- StatusElement.updateContent(data)'))
      .then(() => Request.get('/api/status'))
      .then((response) => {

        let status = response.data

        status.nowAsDate = Date.parse(status.now)
        status.nowAsDateString = status.nowAsDate.toString('MMM d, yyyy')
        status.nowAsTimeString = status.nowAsDate.toString('h:mm tt')

        // Log.debug('- StatusElement.updateContent(data) status.cacheTimestamp=%j', status.cacheTimestamp)
        // Log.debug('- StatusElement.updateContent(data) window.application.cacheTimestamp=%j', window.application.cacheTimestamp)

        status.isRefreshRequired = false
        // status.isUpdateRequired = window.application.cacheTimestamp != status.cacheTimestamp
        status.isUpdateRequired = window.application.version != status.version

        status.heap.totalAsString = Format(status.heap.total, {
         scale: 'binary',
         unit: 'B'
        })
        status.heap.usedAsString = Format(status.heap.used, {
         scale: 'binary',
         unit: 'B'
        })

        data.status = status

        // if (this.getContent()) {
          return super.updateContent(data)
        //   return Promise.resolve(true)
        // }
        // else
        //   return Promise.resolve(false)

      })
      // .catch((error) => window.application.showError(error))
      // .then((reUpdateContent) => {
      //   if (reUpdateContent)
      //     Promise.resolve()
      //       .then(() => Timeout.start('StatusElement.updateContent', 61000))
      //       .then(() => window.application.showSpinner())
      //       .then(() => this.statusElement.updateContent())
      //       .then(() => window.application.hideSpinner())
      //       .catch((error) => {
      //         window.application.hideSpinner()
      //         window.application.showError(error)
      //       })
      //
      //   return Promise.resolve()
      //
      // })
      // .then(() => {
      //   Promise.resolve()
      //     .then(() => Interval.startBySelector(`#${this.id} #onRefreshInterval`, 60))
      //     .then(() => this.updateContent())
      //     .catch((error) => {
      //
      //       if (Is.error(error)) {
      //         Log.error('- StatusElement.updateContent(data)')
      //         Log.error(error)
      //       }
      //       else
      //         window.application.showError(error)
      //
      //     })
      // })
  }

  bindEvents() {
    super.bindEvents()
  }

  unbindEvents() {
    // Timeout.stop('StatusElement.updateContent')
    // Interval.stopBySelector(`#${this.id} #onRefreshInterval`)
    this.stopInterval(`#onRefreshInterval`)
    super.unbindEvents()
  }

}

module.exports = StatusElement
