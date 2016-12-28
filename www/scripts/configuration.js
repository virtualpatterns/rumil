'use strict'

const Utilities = require('util')

const Log = require('./log')

class Configuration {

  static assign(configuration) {
    // Log.debug('- Configuration.assign(configuration) { ... }\n\n%s\n\n', Utilities.inspect(configuration))
    Object.assign(this, configuration)
  }

}

module.exports = Configuration
