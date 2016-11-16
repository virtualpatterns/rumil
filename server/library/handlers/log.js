'use strict'

const Utilities = require('util')
const _Log = require('../log')

let Log = Object.create(_Log)

Log.createHandlers = function(server) {

  server.use((request, response, next) => {
    // this.info('- %s %s\n\n%s\n', request.method, request.url, Utilities.inspect(request.params))
    this.info('- %s %s', request.method, request.url)
    next()
  })

}

module.exports = Log
