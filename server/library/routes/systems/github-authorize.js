'use strict'

const _Authorize = require('client-oauth2')

const Log = require('../../log')
const Process = require('../../process')

class GitHubAuthorize extends _Authorize {

  constructor(scopes = []) {
    super({
      'clientId': Process.env.RUMIL_GITHUB_PUBLIC_ID,
      'clientSecret': Process.env.RUMIL_GITHUB_PRIVATE_ID,
      'accessTokenUri': 'https://github.com/login/oauth/access_token',
      'authorizationUri': 'https://github.com/login/oauth/authorize',
      'authorizationGrants': ['credentials'],
      'redirectUri': `http://dumbledore.local:8080/www/authorize/GitHub${scopes.length == 0 ? `` : `?scopes=${encodeURI(scopes.join(','))}`}`,
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
