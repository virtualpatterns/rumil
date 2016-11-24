'use strict'

const Assert = require('assert')

const DefaultAutomate = require('../applications/default-automate')
const DefaultPage = require('../elements/pages/default-page')
const DefaultSelect = require('../applications/default-select')

describe('DefaultPage', () => {

  before(() => {
    return DefaultAutomate.whenPageShown(() => {
      window.application.pushPage(new DefaultPage())
    })
  })

  it('should contain the title Features', () => {
    Assert.equal(DefaultSelect.getToolbarText(), 'Features')
  })

  it('should contain an item for Status', () => {
    Assert.equal(DefaultSelect.existsListItem('Status'), true)
  })

  it('should contain an item for Tests', () => {
    Assert.equal(DefaultSelect.existsListItem('Tests'), true)
  })

  it('should contain an item for Alert', () => {
    Assert.equal(DefaultSelect.existsListItem('Alert'), true)
  })

  it('should contain an item for Confirmation', () => {
    Assert.equal(DefaultSelect.existsListItem('Confirmation'), true)
  })

  describe('(when the item for Status is clicked)', () => {

    before(() => {
      return DefaultAutomate.whenPageShown(() => {
        DefaultAutomate.clickListItem('Status')
      })
    })

    it('should contain the title Status', () => {
      Assert.equal(DefaultSelect.getToolbarText(), 'Status')
    })

    after(() => {
      return DefaultAutomate.whenPageShown(() => {
        window.application.popPage()
      })
    })

  })

  describe('(when the item for Status and the Features button are clicked)', () => {

    before(() => {
      return Promise.resolve()
        .then(() => DefaultAutomate.whenPageShown(() => {
          DefaultAutomate.clickListItem('Status')
          }
        ))
        .then(() => DefaultAutomate.whenPageShown(() => {
          DefaultAutomate.clickToolbarButton('Features')
          }
        ))
    })

    it('should contain the title Features', () => {
      Assert.equal(DefaultSelect.getToolbarText(), 'Features')
    })

  })

  describe('(when the item for Alert is clicked)', () => {

    let dialog = null

    before(() => {
      return DefaultAutomate.whenDialogShown(() => {
        DefaultAutomate.clickListItem('Alert')
      })
        .then((_dialog) => {
          dialog = _dialog
        })
    })

    it('should show an alert dialog with the text Danger!', () => {
      Assert.equal(DefaultSelect.getAlertText(), 'Danger!')
    })

    after(() => {
      return DefaultAutomate.whenDialogHidden(() => {
        window.application.hideDialog(dialog)
      })
    })

  })

  describe('(when the item for Alert and the Ok button are clicked)', () => {

    before(() => {
      return Promise.resolve()
        .then(() => DefaultAutomate.whenDialogShown(() => {
          DefaultAutomate.clickListItem('Alert')
        }))
        .then(() => DefaultAutomate.whenDialogHidden(() => {
          DefaultAutomate.clickAlertButton('Ok')
        }))
    })

    it('should hide the alert dialog with the text Danger!', () => {
      Assert.equal(DefaultSelect.existsAlertText('Danger!'), false)
    })

  })

  describe('(when the item for Confirmation is clicked)', () => {

    let dialog = null

    before(() => {
      return DefaultAutomate.whenDialogShown(() => {
        DefaultAutomate.clickListItem('Confirmation')
      })
        .then((_dialog) => {
          dialog = _dialog
        })
    })

    it('should show a confirmation dialog with the text Are you sure?', () => {
      Assert.equal(DefaultSelect.getConfirmationText(), 'Are you sure?')
    })

    after(() => {
      return Promise.resolve()
        .then(() => DefaultAutomate.whenDialogShown(() => {
          window.application.hideDialog(dialog)
        }))
        .then((_dialog) => {
          dialog = _dialog
        })
        .then(() => DefaultAutomate.whenDialogHidden(() => {
          window.application.hideDialog(dialog)
        }))
    })

  })

  describe('(when the item for Confirmation and the Yes button are clicked)', () => {

    let dialog = null

    before(() => {
      return Promise.resolve()
        .then(() => DefaultAutomate.whenDialogShown(() => {
          DefaultAutomate.clickListItem('Confirmation')
        }))
        .then(() => DefaultAutomate.whenDialogShown(() => {
          DefaultAutomate.clickConfirmationButton('Yes')
        }))
        .then((_dialog) => {
          dialog = _dialog
        })
    })

    it('should show an alert dialog with the text You said ... Yes.', () => {
      Assert.equal(DefaultSelect.getAlertText(), 'You said ... Yes.')
    })

    after(() => {
      return DefaultAutomate.whenDialogHidden(() => {
        window.application.hideDialog(dialog)
      })
    })

  })

  describe('(when the item for Confirmation and the No button are clicked)', () => {

    let dialog = null

    before(() => {
      return Promise.resolve()
        .then(() => DefaultAutomate.whenDialogShown(() => {
          DefaultAutomate.clickListItem('Confirmation')
        }))
        .then(() => DefaultAutomate.whenDialogShown(() => {
          DefaultAutomate.clickConfirmationButton('No')
        }))
        .then((_dialog) => {
          dialog = _dialog
        })
    })

    it('should show an alert dialog with the text You said ... No.', () => {
      Assert.equal(DefaultSelect.getAlertText(), 'You said ... No.')
    })

    after(() => {
      return DefaultAutomate.whenDialogHidden(() => {
        window.application.hideDialog(dialog)
      })
    })

  })

  after(() => {
    return DefaultAutomate.whenPageShown(() => {
      window.application.popPage()
    })
  })

})
