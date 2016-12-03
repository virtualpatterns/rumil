'use strict'

const Authorize = require('client-oauth2')

const Log = require('../../log')
const Process = require('../../process')

class GitHubAuthorize extends Authorize {

  constructor(scopes = []) {
    super({
      'clientId': Process.env.RUMIL_GITHUB_PUBLIC_ID,
      'clientSecret': Process.env.RUMIL_GITHUB_PRIVATE_ID,
      'accessTokenUri': 'https://github.com/login/oauth/access_token',
      'authorizationUri': 'https://github.com/login/oauth/authorize',
      'authorizationGrants': ['credentials'],
      'redirectUri': 'http://localhost:8080/www/authorize/GitHub',
      'scopes': scopes
    })
  }

  getUri() {
    return this.code.getUri()
  }

  getToken(uri) {
    return this.code.getToken(uri)
  }

}

module.exports = GitHubAuthorize
