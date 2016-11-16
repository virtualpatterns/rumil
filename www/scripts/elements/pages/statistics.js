'use strict'

const _Date = require('datejs')
const Timeout = require('timer-promise')

const Element = require('../../element')
const Log = require('../../log')

const ContentFn = require('./statistics.pug')

class Statistics extends Element {

  constructor(contentFn = ContentFn) {
    super(contentFn)
    // this.statistics = {}
  }

  unbindEvents() {
    Timeout.stop('Statistics.updateContent')
    super.unbindEvents()
  }

  updateContent(statistics = {}) {
    Log.debug('- Statistics.updateContent(data)')

    this.statistics = statistics

    return super.updateContent({})

  }

}

module.exports = Statistics
