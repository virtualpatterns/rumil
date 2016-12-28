'use strict'

const Utilities = require('util')

const Log = require('./log')
const Path = require('./path')

class Configuration {

  static assignPath(path) {
    // console.log(Log.format('DEBUG', '- Configuration.assignPath(%j) { ... }', Path.trim(path)))
    Object.assign(this, require(Path.resolve(path))(this))
  }

}

Configuration.assignPath(Path.join(__dirname, 'configurations', 'default-configuration.js'))

module.exports = Configuration
