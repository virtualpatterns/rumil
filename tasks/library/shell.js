'use strict'

const Shell = require('pshell')

module.exports = {

  'ShellEcho': Shell.context({
    'echoCommand': true,
    'ignoreError': false
  }),
  'ShellQuiet': Shell.context({
    'echoCommand': false,
    'ignoreError': false
  }),
  'ShellSilent': Shell.context({
    'echoCommand': false,
    'ignoreError': true
  })

}
