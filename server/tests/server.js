'use strict'

const Assert = require('assert')
const Asynchronous = require('async')
// const HTTP = require('http');
const Request = require('request-promise-native')
const Utilities = require('util')

const Log = require('../library/log')
const Package = require('../../package.json')
const Path = require('../library/path')
const Process = require('../library/process')
const Server = require('../library/server')

const ADDRESS = '0.0.0.0'
const PORT = 8081
const STATIC_PATH = Path.join(Process.cwd(), 'www')
const MODULES_PATH = Path.join(Process.cwd(), 'node_modules')

const Defaults = Request.defaults({
  'baseUrl': `http://${ADDRESS}:${PORT}`,
  'resolveWithFullResponse': true
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

    // vendor/mocha/mocha.css
    // vendor/mocha/mocha.js

    let methods = ['HEAD', 'GET']
    let urls = ['/favicon.ico', '/', '/www', '/www/vendor/mocha/mocha.css', '/www/vendor/mocha/mocha.js', '/www/index.html', '/www/authorize/GitHub', '/www/authorize/GitHub?scopes=user,repo', '/api/status']

    for (let method of methods) {

      for (let url of urls) {

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

    methods = ['GET']
    urls = ['/www/authorize/GitHub?code=123']

    for (let method of methods) {

      for (let url of urls) {

        describe(`${method} ${url}`, () => {

          // it('should respond with 500 Internal Server Error', () => {
          it('should respond with 500 Internal Server Error', () => {
            return Defaults({
              'method': method,
              'uri': url
            })
              // .then((response) => {
              //   Log.debug('- response.statusCode=%j', response.statusCode)
              //   // Assert.equal(500, response.statusCode)
              // })
              .catch((error) => {
                // Log.inspect(error)
                Assert.equal(500, error.statusCode)
              })
          })

        })

      }

    }

    describe(`GET /api/status`, () => {

      it('should respond with name, now, ...', (callback) => {
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

    let methods = ['HEAD', 'GET']
    // let urls = ['/favicon.ico', '/', '/www', '/www/index.html', '/www/authorize/GitHub', '/api/status']
    let urls = ['/favicon.ico', '/', '/www', '/www/vendor/mocha/mocha.css', '/www/vendor/mocha/mocha.js', '/www/index.html', '/www/authorize/GitHub', '/www/authorize/GitHub?scopes=user,repo', '/www/authorize/GitHub?code=123', '/api/status']

    for (let method of methods) {

      for (let url of urls) {

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
