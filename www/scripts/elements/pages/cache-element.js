// 'use strict'
//
// const Timeout = require('timer-promise')
//
// const Element = require('../../element')
// const Log = require('../../log')
//
// const ContentFn = require('./cache-element.pug')
//
// class CacheElement extends Element {
//
//   constructor(contentFn = ContentFn) {
//     super(contentFn)
//   }
//
//   renderContent(data = {}) {
//
//     if (!data.status) {
//
//       data.status = {}
//
//       // switch (window.applicationCache.status) {
//       //     case window.applicationCache.UNCACHED:
//       //         data.status.icon = 'fa-cloud'
//       //         data.status.name = 'Cache Disabled'
//       //         data.status.description = 'The application cache is disabled.'
//       //         break;
//       //     case window.applicationCache.IDLE:
//       //         data.status.icon = 'fa-cloud-download'
//       //         data.status.name = 'Cache Enabled'
//       //         // data.status.description = 'The application cache is enabled and updates may be available.  Click below to download any updates.'
//       //         data.status.description = 'The application cache is enabled and updates may be available.'
//       //         break;
//       //     case window.applicationCache.UPDATEREADY:
//       //         // window.applicationCache.swapCache();
//       //         data.status.icon = 'fa-cloud-download'
//       //         data.status.name = 'Cache Updated'
//       //         data.status.description = 'The application cache is enabled and updates have been downloaded.'
//       //         break;
//       //     case window.applicationCache.OBSOLETE:
//       //         data.status.icon = 'fa-cloud-download'
//       //         data.status.name = 'Cache Obsolete'
//       //         data.status.description = 'The application cache is obsolete.'
//       //         break;
//       //     default:
//       //         data.status.icon = 'fa-cloud'
//       //         data.status.name = 'Unknown'
//       //         data.status.description = `The status of the application cache is unknown (${this.status}.`
//       // }
//
//       if (window.application.isCacheEnabled) {
//         data.status.icon = 'fa-ellipsis-h'
//         data.status.name = 'Checking'
//         data.status.description = 'Checking for application cache updates ...'
//       }
//       else {
//         data.status.icon = 'fa-times'
//         data.status.name = 'Cache Disabled'
//         data.status.description = 'The application cache is disabled.'
//       }
//
//     }
//
//     return super.renderContent(data)
//
//   }
//
//   // bindEvents() {
//   //   super.bindEvents()
//   //
//   //   window.applicationCache.addEventListener('checking', this._onUpdating = this.onUpdating.bind(this));
//   //   window.applicationCache.addEventListener('downloading', this._onDownloading = this.onDownloading.bind(this));
//   //   window.applicationCache.addEventListener('progress', this._onDownloaded = this.onDownloaded.bind(this));
//   //   window.applicationCache.addEventListener('cached', this._onUpdated = this.onUpdated.bind(this));
//   //   window.applicationCache.addEventListener('updateready', this._onUpdateReady = this.onUpdateReady.bind(this));
//   //   window.applicationCache.addEventListener('noupdate', this._onNoUpdate = this.onNoUpdate.bind(this));
//   //   window.applicationCache.addEventListener('obsolete', this._onObsolete = this.onObsolete.bind(this));
//   //   window.applicationCache.addEventListener('error', this._onError = this.onError.bind(this));
//   //
//   // }
//
//   unbindEvents() {
//
//     // window.applicationCache.removeEventListener('error', this._onError);
//     // window.applicationCache.removeEventListener('obsolete', this._onObsolete);
//     // window.applicationCache.removeEventListener('noupdate', this._onNoUpdate);
//     // window.applicationCache.removeEventListener('updateready', this._onUpdateReady);
//     // window.applicationCache.removeEventListener('cached', this._onUpdated);
//     // window.applicationCache.removeEventListener('progress', this._onDownloaded);
//     // window.applicationCache.removeEventListener('downloading', this._onDownloading);
//     // window.applicationCache.removeEventListener('checking', this._onUpdating);
//
//     Timeout.stop('CacheElement.onUpdateReady')
//     // Timeout.stop('CacheElement.onObsolete')
//
//     super.unbindEvents()
//   }
//
//   // onUpdating() {
//   //   Log.info('- CacheElement.onUpdating()')
//   //
//   //   let data = {
//   //     'status': {
//   //       'icon': 'fa-ellipsis-h',
//   //       'name': 'Checking',
//   //       'description': 'Checking for application cache updates ...'
//   //     }
//   //   }
//   //
//   //   try {
//   //     this.updateContent(data)
//   //   }
//   //   catch (error) {
//   //     window.application.showError(error)
//   //   }
//   //
//   // }
//
//   onDownloading() {
//     Log.info('- CacheElement.onDownloading()')
//
//     let data = {
//       'status': {
//         'icon': 'fa-cloud-download',
//         'name': 'Downloading',
//         'description': 'Downloading application cache updates ...'
//       }
//     }
//
//     try {
//       this.updateContent(data)
//     }
//     catch (error) {
//       window.application.showError(error)
//     }
//
//   }
//
//   onDownloaded(event) {
//     Log.info('- CacheElement.onDownloaded()')
//
//     let data = {
//       'status': {
//         'icon': 'fa-cloud-download',
//         'name': 'Downloading',
//         'description': `Downloaded ${(event.loaded + 1)} of ${event.total} application cache update(s).`
//       }
//     }
//
//     try {
//       this.updateContent(data)
//     }
//     catch (error) {
//       window.application.showError(error)
//     }
//
//   }
//
//   // onUpdated() {
//   //   Log.info('- CacheElement.onUpdated()')
//   //
//   //   let data = {
//   //     'status': {
//   //       'name': 'onUpdated',
//   //       'description': 'onUpdated'
//   //     }
//   //   }
//   //
//   //   try {
//   //     this.updateContent(data)
//   //   }
//   //   catch (error) {
//   //     window.application.showError(error)
//   //   }
//   //
//   // }
//
//   onUpdateReady() {
//     Log.info('- CacheElement.onUpdateReady()')
//
//     let data = {
//       'status': {
//         'icon': 'fa-cloud-download',
//         'name': 'Cache Updated',
//         'description': 'Application cache updates have been downloaded and will be applied in 5 seconds.'
//       }
//     }
//
//     try {
//       this.updateContent(data)
//     }
//     catch (error) {
//       window.application.showError(error)
//     }
//
//     Timeout.start('CacheElement.onUpdateReady', 5000)
//       .then(() => window.location.reload(true))
//       .catch((error) => window.application.showError(error))
//
//   }
//
//   onNoUpdate() {
//     Log.info('- CacheElement.onNoUpdate()')
//
//     let data = {
//       'status': {
//         'icon': 'fa-cloud',
//         'name': 'Cache Current',
//         'description': 'There are no application cache updates to download.'
//       }
//     }
//
//     try {
//       this.updateContent(data)
//     }
//     catch (error) {
//       window.application.showError(error)
//     }
//
//   }
//
//   // onObsolete() {
//   //   Log.info('- CacheElement.onObsolete()')
//   //
//   //   let data = {
//   //     'status': {
//   //       'icon': 'fa-cloud-download',
//   //       'name': 'Cache Obsolete',
//   //       'description': 'The application cache is obsolete.'
//   //     }
//   //   }
//   //
//   //   try {
//   //     this.updateContent(data)
//   //     window.applicationCache.update()
//   //   }
//   //   catch (error) {
//   //     window.application.showError(error)
//   //   }
//   //
//   // }
//
//   onError() {
//     Log.info('- CacheElement.onError()')
//
//     let data = {
//       'status': {
//         'icon': 'fa-cloud',
//         'name': 'Error',
//         'description': 'An error occurred checking for and/or downloading application cache updates.'
//       }
//     }
//
//     try {
//       this.updateContent(data)
//     }
//     catch (error) {
//       window.application.showError(error)
//     }
//
//   }
//
// }
//
// module.exports = CacheElement

'use strict'

const Timeout = require('timer-promise')

const Element = require('../../element')
const Log = require('../../log')

const ContentFn = require('./cache-element.pug')

class CacheElement extends Element {

  constructor(contentFn = ContentFn) {
    super(contentFn)
  }

  renderContent(data = {}) {
    // Log.debug('- CacheElement.renderContent(data)')
    data.status = data.status || {
      'isEventUndefined': true
    }
    return super.renderContent(data)
  }

  unbindEvents() {

    Timeout.stop('CacheElement.onUpdateReady')
    Timeout.stop('CacheElement.onNoUpdate')

    super.unbindEvents()
  }

  onDownloading() {
    Log.info('- CacheElement.onDownloading()')

    let data = {
      'status': {
        'isEventUndefined': false,
        'isDownloading': true,
        'isUpdateRequired': false,
        'isError': false
      }
    }

    try {
      this.updateContent(data)
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onUpdateReady() {
    Log.info('- CacheElement.onUpdateReady()')

    let data = {
      'status': {
        'isEventUndefined': false,
        'isDownloading': false,
        'isUpdateRequired': true,
        'isError': false
      }
    }

    try {
      this.updateContent(data)
    }
    catch (error) {
      window.application.showError(error)
    }

    Timeout.start('CacheElement.onUpdateReady', 5000)
      .then(() => window.location.reload(true))
      .catch((error) => window.application.showError(error))

  }

  onNoUpdate() {
    Log.info('- CacheElement.onNoUpdate()')

    let data = {
      'status': {
        'isEventUndefined': false,
        'isDownloading': false,
        'isUpdateRequired': false,
        'isError': false
      }
    }

    try {
      this.updateContent(data)
    }
    catch (error) {
      window.application.showError(error)
    }

    Timeout.start('CacheElement.onNoUpdate', 61000)
      .then(() => window.applicationCache.update())
      .catch((error) => window.application.showError(error))

  }

  onError(event) {
    Log.info('- CacheElement.onError(event)')

    window.application.showError(event)

  }

}

module.exports = CacheElement
