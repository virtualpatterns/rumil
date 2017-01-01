'use strict'

const Co = require('co')
const Search = require('query-string')
const Timeout = require('timer-promise')

const ApplicationContext = require.context('./applications', true, /-application\.js/)
const Configuration = require('./configuration')
const DefaultApplication = require('./applications/default-application')
const Log = require('./log')

ons.ready(Co.wrap(function* () {
  Log.debug('- ons.ready(() => { ... })')

  try {

    yield Configuration.assignPath('/www/configuration.json')

    Log.debug(Configuration)

    let search = Search.parse(window.location.search)

    // Log.debug(search)

    let Application = search.application ? ApplicationContext(`./${search.application.toLowerCase()}-application.js`) : DefaultApplication

    window.application = new Application()
    window.application.addContent()

    yield Timeout.start('ons.ready', 0)

    window.application.emitReady()

  }
  catch (error) {
    Log.error('- ons.ready(() => { ... })')
    Log.error(error)
  }

}))

window.onerror = (message, file, line) => {
  Log.error('- window.onerror(message, file, line) => { ... }')
  Log.error('-   message=%j', message)
  Log.error('-   file=%j', file)
  Log.error('-   line=%j', line)
}
