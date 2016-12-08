'use strict'

const Promisify = require("es6-promisify");
const _Twitter = require('node-twitter-api')
const Utilities = require('util')

const Log = require('../../log')
const Process = require('../../process')
const SimpleAuthorization = require('./simple-authorization')

class TwitterAuthorization extends SimpleAuthorization {

  constructor(request, response, next) {
    super(request, response, next)
  }

  getToken() {
    return this.request.params.oauth_token
  }

  getVerifier() {
    return this.request.params.oauth_verifier
  }

  authorize(token = {}) {
    Log.debug('- TwitterAuthorization.authorize(token) { ... }')

    // let options = this.getOptions()
    // Log.debug('-   options ...\n\n%s\n', Utilities.inspect(options))
    //
    // let oauth = new OAuth(options)
    //
    // if (!this.getCode())
    //   this.redirect(oauth.code.getUri())
    // else {
    //
    //   Log.debug('> oauth.code.getToken(%j)', this.request.url)
    //   return oauth.code.getToken(this.request.url)
    //     .then((token) => super.authorize(token.data))
    //     .catch((error) => this.sendError(error))
    //
    // }

    // let [ publicRequestId, privateRequestId, ...parameters ] = yield Twitter.Promise.getRequestToken()

    const Twitter = new _Twitter({
      'callback': `http://localhost:8080/api/authorize/Twitter?authorizationId=${this.getAuthorizationId()}`,
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

    if (!this.getToken()) {
      return Twitter.Promise.getRequestToken()
        .then((data) => {

          let [ publicRequestId, privateRequestId, ...parameters ] = data

          // Log.debug('-   this.request.url=%j', this.request.url)
          Log.debug('-   publicRequestId=%j', publicRequestId)
          Log.debug('-   privateRequestId=%j', privateRequestId)
          Log.debug('-   parameters=\n\n%s\n', Utilities.inspect(parameters))

          TwitterAuthorization.authorizations[this.getAuthorizationId()] = {
            'publicRequestId': publicRequestId,
            'privateRequestId': privateRequestId,
            'created': new Date()
          }

          this.redirect(Twitter.getAuthUrl(publicRequestId))

        })
        .catch((error) => this.sendError(error))
    }
    else {

      // Log.debug('-   this.getToken()=%j', this.getToken())
      // Log.debug('-   this.getVerifier()=%j', this.getVerifier())

      let { publicRequestId, privateRequestId } = TwitterAuthorization.authorizations[this.getAuthorizationId()]

      // Log.debug('-   publicRequestId=%j', publicRequestId)
      // Log.debug('-   privateRequestId=%j', privateRequestId)

      return Twitter.Promise.getAccessToken(publicRequestId, privateRequestId, this.getVerifier())
        .then((data) => {

          let [ publicAccessId, privateAccessId, ...parameters ] = data

          // Log.debug('-   this.request.url=%j', this.request.url)
          Log.debug('-   publicAccessId=%j', publicAccessId)
          Log.debug('-   privateAccessId=%j', privateAccessId)
          Log.debug('-   parameters=\n\n%s\n', Utilities.inspect(parameters))

          // this.sendError(new Error('Hold!'))

          super.authorize({
            'publicAccessId': publicAccessId,
            'privateAccessId': privateAccessId
          })

        })
        .catch((error) => this.sendError(error))

    }

  }

}

TwitterAuthorization.authorizations = {}

module.exports = TwitterAuthorization
