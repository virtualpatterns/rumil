'use strict'

const CacheElement = require('./cache-element')
const Log = require('../../log')
const NavigatedPage = require('./navigated-page')

const ContentFn = require('./cache-page.pug')

class CachePage extends NavigatedPage {

  constructor(contentFn = ContentFn) {
    super(contentFn)
    this.cacheElement = new CacheElement()
  }

  // renderContent(data = {}) {
  //   data.applicationCache = window.applicationCache
  //   return super.renderContent(data)
  // }

  bindEvents() {
    super.bindEvents()

    this.cacheElement.bindEvents()

    this.getContent().querySelector('#goRefresh').addEventListener('click', this._onGoRefresh = this.onGoRefresh.bind(this))

    // window.applicationCache.addEventListener('checking', this._onUpdating = this.cacheElement.onUpdating.bind(this.cacheElement));
    window.applicationCache.addEventListener('downloading', this._onDownloading = this.cacheElement.onDownloading.bind(this.cacheElement));
    // window.applicationCache.addEventListener('progress', this._onDownloaded = this.cacheElement.onDownloaded.bind(this.cacheElement));
    // window.applicationCache.addEventListener('cached', this._onUpdated = this.cacheElement.onUpdated.bind(this.cacheElement));
    window.applicationCache.addEventListener('updateready', this._onUpdateReady = this.cacheElement.onUpdateReady.bind(this.cacheElement));
    window.applicationCache.addEventListener('noupdate', this._onNoUpdate = this.cacheElement.onNoUpdate.bind(this.cacheElement));
    // window.applicationCache.addEventListener('obsolete', this._onObsolete = this.cacheElement.onObsolete.bind(this.cacheElement));
    window.applicationCache.addEventListener('error', this._onError = this.cacheElement.onError.bind(this.cacheElement));

  }

  unbindEvents() {

    window.applicationCache.removeEventListener('error', this._onError);
    // window.applicationCache.removeEventListener('obsolete', this._onObsolete);
    window.applicationCache.removeEventListener('noupdate', this._onNoUpdate);
    window.applicationCache.removeEventListener('updateready', this._onUpdateReady);
    // window.applicationCache.removeEventListener('cached', this._onUpdated);
    // window.applicationCache.removeEventListener('progress', this._onDownloaded);
    window.applicationCache.removeEventListener('downloading', this._onDownloading);
    // window.applicationCache.removeEventListener('checking', this._onUpdating);

    this.getContent().querySelector('#goRefresh').removeEventListener('click', this._onGoRefresh)

    this.cacheElement.unbindEvents()

    super.unbindEvents()
  }

  onGoRefresh() {
    Log.debug('- CachePage.onGoRefresh()')

    try {
      window.applicationCache.update()
    }
    catch (error) {
      window.application.showError(error)
    }

  }

  onShown(isInitial) {
    super.onShown(isInitial)

    Log.debug('- CachePage.onShown(%s)', isInitial)

    try {
      window.applicationCache.update()
    }
    catch (error) {
      window.application.showError(error)
    }

  }

}

module.exports = CachePage
