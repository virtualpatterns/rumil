'use strict'

const Search = require('query-string')
const Utilities = require('util')

const Application = require('../application')
const Log = require('../log')

const ContentFn = require('./authorized-application.pug')

class AuthorizedApplication extends Application {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

  onReady() {

    try {

      super.onReady()

      let search = Search.parse(window.location.search);

      Log.debug('- AuthorizedApplication.onReady()');
      // Log.debug('-   search.scopes=%j', search.scopes);
      // Log.debug('-   search.system=%j', search.system);
      Log.debug('-   search.authorizationId=%j', search.authorizationId);
      Log.debug('-   search.token=\n\n%s\n', Utilities.inspect(JSON.parse(search.token)));

      window.opener.application.emitAuthorized(search.authorizationId, JSON.parse(search.token))

      window.close()

    }
    catch (error) {
      window.application.showError(error)
    }

  }

}

module.exports = AuthorizedApplication
