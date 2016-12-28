'use strict'

const Assert = require('assert')
const Asynchronous = require('async')
// const HTTP = require('http');
const Query = require('querystring')
const Request = require('request-promise-native')
const Utilities = require('util')

const Log = require('../library/log')
const Package = require('../../package.json')
const Path = require('../library/path')
const Process = require('../library/process')
const Server = require('../library/server')

const ADDRESS = '0.0.0.0'
const PORT = 8181
const STATIC_PATH = Path.join(__dirname, '..', '..', 'www')
const MODULES_PATH = Path.join(__dirname, '..', '..', 'node_modules')

const METHODS = [
  'HEAD',
  'GET'
]

const URLS_200 = [
  '/favicon.ico',
  '/',
  '/www',
  '/www/vendor/mocha/mocha.css',
  '/www/vendor/mocha/mocha.js',
  '/www/index.html',
  '/api/authorize/simple?authorizationId=123',
  '/api/authorize/twitter?authorizationId=123',
  '/api/status'
]

const URLS_500 = [
  '/api/authorize/oauth2?authorizationId=123',
  '/api/authorize/github?authorizationId=123',
  `/api/authorize/google?authorizationId=123&options=${Query.escape(JSON.stringify({
    'scopes': [ 'profile' ]
  }))}`,
  '/api/authorize/system?authorizationId=123'
]

const Defaults = Request.defaults({
  'baseUrl': `http://${ADDRESS}:${PORT}`,
  'resolveWithFullResponse': true
})

before(() => {
})

after(() => {
})

describe('Server', () => {

  let server = null

  before(() => {
    server = Server.createServer(STATIC_PATH, MODULES_PATH)
  })

  describe('listen', () => {

    before((callback) => {
      server
        .listen(PORT, ADDRESS)
        .once('listening', callback)
    })

    for (let method of METHODS) {

      for (let url of URLS_200) {

        describe(`${method} ${url}`, () => {

          it('should respond with 200 OK', () => {
            return Defaults({
              'method': method,
              'uri': url
            })
              .then((response) => Assert.equal(200, response.statusCode))
          })

        })

      }

    }

    for (let method of [
      'GET'
    ]) {

      for (let url of URLS_500) {

        describe(`${method} ${url}`, () => {

          it('should respond with 500 Internal Server Error', () => {
            return Defaults({
              'method': method,
              'uri': url
            })
              .catch((error) => {
                Assert.equal(500, error.statusCode)
              })
          })

        })

      }

    }

    describe(`GET /api/status`, () => {

      it('should respond with name, version, ...', (callback) => {
        Defaults({
          'json': true,
          'method': 'GET',
          'uri': '/api/status'
        })
          .then((response) => {

            let message = 'The %j property doesn\'t exist.'

            Assert.ok(response.body.name, Utilities.format(message, 'name'))
            Assert.ok(response.body.now, Utilities.format(message, 'now'))
            Assert.ok(response.body.version, Utilities.format(message, 'version'))

            Assert.ok(response.body.heap, Utilities.format(message, 'heap'))
            Assert.ok(response.body.heap.total, Utilities.format(message, 'heap.total'))
            Assert.ok(response.body.heap.used, Utilities.format(message, 'heap.used'))

            Assert.ok(response.body.storage, Utilities.format(message, 'storage'))
            Assert.ok(response.body.storage.version, Utilities.format(message, 'storage.version'))
            Assert.ok(response.body.storage.os, Utilities.format(message, 'storage.os'))

            callback()

          })
          .catch((error) => callback(error))
      })

    })

    after((callback) => {
      server
        .close()
        .once('close', callback)
    })

  })

  describe('close', () => {

    before((callback) => {

      Asynchronous.series([
        function(callback) {
          server
            .listen(PORT, ADDRESS)
            .once('listening', callback)
        },
        function(callback) {
          server
            .close()
            .once('close', callback)
        }
      ], callback);

    })

    for (let method of METHODS) {

      for (let url of [].concat(URLS_200, URLS_500)) {

        describe(`${method} ${url}`, () => {

          it('should fail', (callback) => {
            Defaults({
              'method': method,
              'uri': url
            })
              .then((response) => callback(new Error(`The server returned ?{response.statusCode} ?{HTTP.STATUS_CODES[response.statusCode]}.`)))
              .catch((error) => callback())
          })

        })

      }

    }

  })

})
