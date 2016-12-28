'use strict'

const Parser = require('redis-info')
const Promisify = require("es6-promisify")
const Redis = require("redis")
const Utilities = require('util')

const Log = require('../../log')
const SimpleAuthorization = require('./simple-authorization')

class StoredAuthorization extends SimpleAuthorization {

  constructor(request, response, next) {
    super(request, response, next)
  }

  open(uri, options = {}) {
    Log.debug('- StoredAuthorization.open(%j, options)\n\n%s\n', uri, Utilities.inspect(options))

    if (!this.storage) {

      options.retry_strategy = options.retry_strategy || ((retry) => {
        Log.warn('- retryFn(retry) { ... }\n\n%s\n', Utilities.inspect(retry))
        return new Error(retry.error.message)
      })

      let storage = uri ? Redis.createClient(uri, options) : Redis.createClient(options)

      storage.Promise = {}
      storage.Promise.ping = Promisify(storage.ping, storage)
      storage.Promise.info = Promisify(storage.info, storage)
      storage.Promise.set = Promisify(storage.hmset, storage)
      storage.Promise.get = Promisify(storage.hgetall, storage)
      storage.Promise.expire = Promisify(storage.expire, storage)

      this.storage = storage

    }

  }

  close() {
    Log.debug('- StoredAuthorization.close()')

    if (this.storage) {
      this.storage.quit()
      delete this.storage
    }

  }

  *ping() {
    Log.debug('- StoredAuthorization.ping()')
    yield this.storage.Promise.ping()
  }

  *info() {
    Log.debug('- StoredAuthorization.info()')
    return Parser.parse(yield this.storage.Promise.info())
  }

  *set(value, seconds = 60) {
    Log.debug('- StoredAuthorization.set(value)\n\n%s\n', Utilities.inspect(value))
    yield this.storage.Promise.set(this.getAuthorizationId(), value)
    yield this.storage.Promise.expire(this.getAuthorizationId(), seconds)
  }

  *get() {
    Log.debug('- StoredAuthorization.get()')
    return yield this.storage.Promise.get(this.getAuthorizationId())
  }

}

module.exports = StoredAuthorization
