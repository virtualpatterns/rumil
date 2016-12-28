'use strict'

const Promisify = require("es6-promisify");
const _Twitter = require('node-twitter-api')
const Utilities = require('util')

const Configuration = require('../../configuration')
const Log = require('../../log')
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

  open(uri = Configuration.twitterStorageUri, options = Configuration.twitterStorageOptions) {
    return super.open(uri, options)
  }

  *authorize(token = {}) {
    Log.debug('- TwitterAuthorization.authorize(token) { ... }')

    const Twitter = new _Twitter({
      'callback': `${Configuration.twitterRedirectUri}?authorizationId=${this.getAuthorizationId()}`,
      'consumerKey': Configuration.twitterPublicKey,
      'consumerSecret': Configuration.twitterPrivateKey
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
