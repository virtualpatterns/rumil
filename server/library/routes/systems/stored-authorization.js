'use strict'

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

    // return new Promise((resolve, reject) => {
      if (!this.storage) {

        let storage = uri ? Redis.createClient(uri, options) : Redis.createClient(options)

        // let _onReady = null
        // let _onError = null

        // storage.once('ready', _onReady = () => {
        //   Log.debug('- storage.once(\'ready\', _onReady = () => { ... })')
        //   // storage.off('ready', _onReady)
        //   // storage.off('error', _onError)
        //   resolve()
        // })
        // storage.once('error', _onError = (error) => {
        //   Log.error('- storage.once(\'error\', _onError = (error) => { ... })')
        //   // storage.off('ready', _onReady)
        //   // storage.off('error', _onError)
        //   reject(error)
        // })

        storage.Promise = {}
        storage.Promise.hmset = Promisify(storage.hmset, storage)
        storage.Promise.hgetall = Promisify(storage.hgetall, storage)
        storage.Promise.expire = Promisify(storage.expire, storage)
        storage.Promise.del = Promisify(storage.del, storage)

        this.storage = storage

      }
    //   else
    //     resolve()
    // })

  }

  close() {
    Log.debug('- StoredAuthorization.close()')

    // return new Promise((resolve, reject) => {
      if (this.storage) {

        let storage = this.storage

        storage.quit()

        // let _onEnd = null
        // let _onError = null
        //
        // storage.once('end', _onEnd = () => {
        //   Log.debug('- storage.once(\'end\', _onEnd = () => { ... })')
        //   // storage.off('end', _onEnd)
        //   // storage.off('error', _onError)
          delete this.storage
        //   resolve()
        // })
        // storage.once('error', _onError = (error) => {
        //   Log.error('- storage.once(\'error\', _onError = (error) => { ... })')
        //   // storage.off('end', _onEnd)
        //   // storage.off('error', _onError)
        //   reject(error)
        // })

      }
    //   else
    //     resolve()
    // })

  }

  set(value) {
    Log.debug('> StoredAuthorization.set(value)\n\n%s\n', Utilities.inspect(value))
    return Promise.resolve()
      .then(() => this.storage.Promise.hmset(this.getAuthorizationId(), value))
      .then(() => {
        Log.debug('< StoredAuthorization.set(value)\n\n%s\n', Utilities.inspect(value))
      })
  }

  get() {
    Log.debug('> StoredAuthorization.get()')
    return Promise.resolve()
      .then(() => this.storage.Promise.hgetall(this.getAuthorizationId()))
      .then((value) => {
        Log.debug('< StoredAuthorization.get()\n\n%s\n', Utilities.inspect(value))
        return Promise.resolve(value)
      })
  }

  expire(seconds = 15) {
    Log.debug('- StoredAuthorization.expire(%j)', seconds)
    return this.storage.Promise.expire(this.getAuthorizationId(), seconds)
  }

  delete() {
    Log.debug('- StoredAuthorization.delete()')
    return this.storage.Promise.del(this.getAuthorizationId())
  }

}

module.exports = StoredAuthorization
