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
    super.onReady()

    let self = this

    Co(function* () {

      try {

          let search = Search.parse(window.location.search);

          Log.debug('- StackedApplication.onReady() search.page=%j', search.page);

          yield self.pushPage(new (search.page ? PageContext(search.page) : Page))

      }
      catch (error) {
        window.application.showError(error)
      }

    })

  }

  onPageShown(page, isInitial) {
    // Log.debug('- StackedApplication.onPageShown(page, %s) page.id=%j', isInitial, page.id)

    // page.addContentElement()
    page.bind()

    page.emitShown(isInitial)

  }

  onPageHidden(page, isFinal) {
    // Log.debug('- StackedApplication.onPageHidden(page, %s) page.id=%j', isFinal, page.id)

    page.emitHidden(isFinal)

    page.unbind()
    // page.removeContentElement()

  }

  pushPage(page, options = {
    'animation': 'slide'
  }) {

    let self = this

    return Co(function* () {

      Log.debug('- StackedApplication.pushPage(page, options)')

      let hiddenPage = self.pages.last()
      let shownPage = page

      self.pages.push(shownPage)

      if (hiddenPage)
        self.emitPageHidden(hiddenPage, false)

      yield self.getContent().pushPage(null, {
        'pageHTML': shownPage.renderContent(),
        'animation': options.animation,
        'animationOptions': options.animationOptions,
        'data': options.data
      })

      self.emitPageShown(shownPage, true)

      return { shownPage, hiddenPage }

    })

    // return Promise.resolve()
    //   .then(() => {
    //     // Log.debug('- StackedApplication.pushPage(page, options)\n%s\n\n', page.renderContent())
    //     Log.debug('- StackedApplication.pushPage(page, options)')
    //
    //     let hiddenPage = this.pages.last()
    //     let shownPage = page
    //
    //     this.pages.push(shownPage)
    //
    //     if (hiddenPage)
    //       this.emitPageHidden(hiddenPage, false)
    //
    //     return this.getContent().pushPage(null, {
    //       'pageHTML': shownPage.renderContent(),
    //       'animation': options.animation,
    //       'animationOptions': options.animationOptions,
    //       'data': options.data
    //     })
    //       .then(() => {
    //
    //         this.emitPageShown(shownPage, true)
    //
    //         return Promise.resolve(shownPage, hiddenPage)
    //
    //       })
    //
    //   })

  }

  canPopPage() {
    return this.pages.length > 1
  }

  popPage(options = {
    'animation': 'slide'
  }) {

    let self = this

    return Co(function* () {

      Log.debug('- StackedApplication.popPage(options)')

      if (self.canPopPage()) {

        let hiddenPage = self.pages.pop()
        let shownPage = self.pages.last()

        self.emitPageHidden(hiddenPage, true)

        yield self.getContent().popPage({
          'animation': options.animation,
          'animationOptions': options.animationOptions
        })

        self.emitPageShown(shownPage, false)

        return { hiddenPage, shownPage }

      }
      else
        throw new RangeError('The last page on the stack cannot be removed.')

    })

    // return Promise.resolve()
    //   .then(() => {
    //     Log.debug('- StackedApplication.popPage(options)')
    //
    //     if (this.canPopPage()) {
    //
    //       let hiddenPage = this.pages.pop()
    //       let shownPage = this.pages.last()
    //
    //       this.emitPageHidden(hiddenPage, true)
    //
    //       return this.getContent().popPage({
    //         'animation': options.animation,
    //         'animationOptions': options.animationOptions
    //       })
    //         .then(() => {
    //
    //           this.emitPageShown(shownPage, false)
    //
    //           return Promise.resolve(hiddenPage, shownPage)
    //
    //         })
    //
    //     }
    //     else
    //       return Promise.reject(new RangeError('The last page on the stack cannot be removed.'))
    //
    //   })

  }

}

module.exports = StackedApplication
