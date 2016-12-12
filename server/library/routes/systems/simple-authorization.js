'use strict'

const Utilities = require('util')

const Log = require('../../log')

class SimpleAuthorization {

  constructor(request, response, next) {
    // Log.debug('- SimpleAuthorization(request, response, next)')
    this.request = request
    this.response = response
    this.next = next
  }

  getAuthorizationId() {
    return this.request.params.authorizationId
  }

  getOptions() {
    return this.request.params.options ? JSON.parse(this.request.params.options) : {}
  }

  redirect(uri) {
    Log.debug('- SimpleAuthorization.redirect(%j) { ... }', uri)
    this.response.redirect(uri, this.next)
  }

  *authorize(token = {}) {
    Log.debug('- SimpleAuthorization.*authorize(token) { ... }\n\n%s\n', Utilities.inspect(token))
    this.redirect(`/www/index.html?application=${encodeURI('./authorized-application.js')}&authorizationId=${encodeURI(this.getAuthorizationId())}&token=${encodeURI(JSON.stringify(token))}`)
  }

}

module.exports = SimpleAuthorization
