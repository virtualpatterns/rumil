 'use strict'

const Co = require('co')
const Search = require('query-string')

const Application = require('../application')
const Log = require('../log')
const PageContext = require.context('../elements/pages', true, /-page\.js/)

const ContentFn = require('./stacked-application.pug')

class StackedApplication extends Application {

  constructor(contentFn = ContentFn) {
    super(contentFn)

    this.pages = []
    this.pages.last = () => this.pages[this.pages.length - 1]

  }

  emitPageShown(page, isInitial) {
    // Log.debug('- StackedApplication.emitPageShown(page, %s) page.id=%j', isInitial, page.id)
    this.emitEvent('pageShown', page, isInitial)
  }

  emitPageHidden(page, isFinal) {
    // Log.debug('- StackedApplication.emitPageHidden(page, %s) page.id=%j', isFinal, page.id)
    this.emitEvent('pageHidden', page, isFinal)
  }

  bind() {
    super.bind()

    this.onEvent('pageShown', this._onPageShown = this.onPageShown.bind(this))
    this.onEvent('pageHidden', this._onPageHidden = this.onPageHidden.bind(this))

  }

  unbind() {

    this.offEvent('pageHidden', this._onPageHidden)
    this.offEvent('pageShown', this._onPageShown)

    super.unbind()
  }

  onReady(Page) {
    Log.debug('- StackedApplication.onReady()');

    let self = this
    let superFn = super.onReady.bind(self)

    Co(function*() {

      try {

          superFn()

          let search = Search.parse(window.location.search);

          // Log.debug(search);

          yield window.application.pushPage(new (search.page ? PageContext(search.page) : Page))

      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

  onPageShown(page, isInitial) {
    // Log.debug('- StackedApplication.onPageShown(page, %s) page.id=%j', isInitial, page.id)

    page.bind()

    page.emitShown(isInitial)

  }

  onPageHidden(page, isFinal) {
    // Log.debug('- StackedApplication.onPageHidden(page, %s) page.id=%j', isFinal, page.id)

    page.emitHidden(isFinal)

    page.unbind()

  }

  *pushPage(page, options = {
    'animation': 'slide'
  }) {
    // Log.debug('- StackedApplication.pushPage(page, options)')

    let hiddenPage = this.pages.last()
    let shownPage = page

    this.pages.push(shownPage)

    if (hiddenPage)
      this.emitPageHidden(hiddenPage, false)

    yield this.getContent().pushPage(null, {
      'pageHTML': shownPage.renderContent(),
      'animation': options.animation,
      'animationOptions': options.animationOptions,
      'data': options.data
    })

    this.emitPageShown(shownPage, true)

    return { shownPage, hiddenPage }

  }

  canPopPage() {
    return this.pages.length > 1
  }

  *popPage(options = {
    'animation': 'slide'
  }) {
    // Log.debug('- StackedApplication.popPage(options)')

    if (this.canPopPage()) {

      let hiddenPage = this.pages.pop()
      let shownPage = this.pages.last()

      this.emitPageHidden(hiddenPage, true)

      yield this.getContent().popPage({
        'animation': options.animation,
        'animationOptions': options.animationOptions
      })

      this.emitPageShown(shownPage, false)

      return { hiddenPage, shownPage }

    }
    else
      throw new RangeError('The last page on the stack cannot be removed.')

  }

}

module.exports = StackedApplication
