'use strict'

const Search = require('query-string')

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
      Log.debug('-   search.scopes=%j', search.scopes);
      Log.debug('-   search.system=%j', search.system);
      Log.debug('-   search.token=%j', search.token);

      window.opener.application.emitAuthorized({
        'scopes': search.scopes ? search.scopes.split(',') : [],
        'system': search.system,
        'value': search.token
      })

      window.close()

    }
    catch (error) {
      window.application.showError(error)
    }

  }

}

module.exports = AuthorizedApplication
