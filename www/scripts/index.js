'use strict'

const Search = require('query-string')
const Timeout = require('timer-promise')

const ApplicationContext = require.context('./applications', true, /-application\.js/)
const DefaultApplication = require('./applications/default-application')
const Log = require('./log')

ons.ready(() => {

  try {

    let search = Search.parse(window.location.search)

    Log.debug('- ons.ready(() => { ... }) search.application=%j', search.application)

    window.application = search.application ? new (ApplicationContext(search.application))() : new DefaultApplication()
    window.application.addContent()
    window.application.addContentElement()

    Timeout.start('ons.ready', 0)
      .then(() => window.application.emitReady())
      .catch((error) => {
        Log.error('- ons.ready(() => { ... })')
        Log.error(error)
      })

  }
  catch (eror) {
    Log.error('- ons.ready(() => { ... })')
    Log.error(error)
  }

})

window.onerror = (message, file, line) => {
  Log.error('- window.onerror(message, file, line) => { ... }')
  Log.error('-   message=%j', message)
  Log.error('-   file=%j', file)
  Log.error('-   line=%j', line)
}
