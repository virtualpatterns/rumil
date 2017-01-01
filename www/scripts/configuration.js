'use strict'

const Request = require('axios')

const Log = require('./log')

class Configuration {

  static *assignPath(path) {
    Log.debug('- Configuration.assignPath(%j) { ... }', path)
    Object.assign(this, (yield Request.get(path)).data)
  }

}

module.exports = Configuration
