'use strict'

const Promisify = require("es6-promisify");
const _Twitter = require('node-twitter-api')
const Utilities = require('util')

const Log = require('../../log')
const Process = require('../../process')
const StoredAuthorization = require('./stored-authorization')

class TwitterAuthorization extends StoredAuthorization {

  constructor(request, response, next) {
    super(request, response, next)
  }

  getRequestToken() {
    return this.request.params.oauth_token
  }

  getVerifier() {
    return this.request.params.oauth_verifier
  }

  open(uri, options = {}) {
    return super.open(uri || Process.env.RUMIL_TWITTER_STORAGE_URL, options)
  }

  *authorize(token = {}) {
    Log.debug('- TwitterAuthorization.authorize(token) { ... }')

    const Twitter = new _Twitter({
      'callback': `http://localhost:8081/api/authorize/Twitter?authorizationId=${this.getAuthorizationId()}`,
      'consumerKey': Process.env.RUMIL_TWITTER_PUBLIC_ID,
      'consumerSecret': Process.env.RUMIL_TWITTER_PRIVATE_ID
    })

    Twitter.Promise = {}
    Twitter.Promise.getRequestToken = Promisify(Twitter.getRequestToken, {
      'multiArgs': true,
      'thisArg': Twitter
    })
    Twitter.Promise.getAccessToken = Promisify(Twitter.getAccessToken, {
      'multiArgs': true,
      'thisArg': Twitter
    })

    if (!this.getRequestToken()) {

      let requestToken = yield Twitter.Promise.getRequestToken()

      let [ publicRequestId, privateRequestId, ...parameters ] = requestToken

      Log.debug('-   publicRequestId=%j', publicRequestId)
      Log.debug('-   privateRequestId=%j', privateRequestId)
      Log.debug('-   parameters=\n\n%s\n', Utilities.inspect(parameters))

      this.open()

      try {
        yield this.set({
          'publicRequestId': publicRequestId,
          'privateRequestId': privateRequestId,
        })
        yield this.expire()
      }
      finally {
        this.close()
      }

      this.redirect(Twitter.getAuthUrl(publicRequestId))

    }
    else {

      let data = null

      this.open()

      try {
        data = yield this.get()
      }
      finally {
        this.close()
      }

      Log.debug('-   data.publicRequestId=%j', data.publicRequestId)
      Log.debug('-   data.privateRequestId=%j', data.privateRequestId)

      let accessToken = yield Twitter.Promise.getAccessToken(data.publicRequestId, data.privateRequestId, this.getVerifier())

      let [ publicAccessId, privateAccessId, ...parameters ] = accessToken

      Log.debug('-   publicAccessId=%j', publicAccessId)
      Log.debug('-   privateAccessId=%j', privateAccessId)
      Log.debug('-   parameters=\n\n%s\n', Utilities.inspect(parameters))

      yield super.authorize({
        'publicAccessId': publicAccessId,
        'privateAccessId': privateAccessId
      })

    }

  }

}

module.exports = TwitterAuthorization
