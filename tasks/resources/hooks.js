var FileSystem = require('fs')
var outputStream = null

module.exports = {

  beforeStart: function(options) {

    try {

      outputStream = FileSystem.open( 'process/logs/rumil.www.log', 'a', 'utf-8')

      outputStream.writeLine('----------------------------------------------------------------')

      // var onConsoleMessageFn = options.page.onConsoleMessage
      //
      // options.page.onConsoleMessage = function(message) {
      //   if (onConsoleMessageFn)
      //     onConsoleMessageFn(message)
      //   else
      //     outputStream.writeLine(message)
      // }

      var onCallbackFn = options.page.onCallback

      options.page.onCallback = function(data) {
        if (data.message)
          outputStream.writeLine(data.message)
        else if (onCallbackFn)
          onCallbackFn(data)
      }

    }
    catch(error) {
      console.log('An error occured in the "beforeStart" hook.')
      console.log(error.stack)
    }

  },
  afterEnd: function(options) {

    try {
      outputStream.close()
    }
    catch(error) {
      console.log('An error occured in the "afterEnd" hook.')
      console.log(error.stack)
    }

  }

}
