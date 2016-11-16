'use strict'

const Assert = require('assert')

const DefaultAutomation = require('../applications/default-automation')
const DefaultPage = require('../elements/pages/default-page')
const DefaultSelection = require('../applications/default-selection')

describe('DefaultPage', () => {

  before(() => {
    return DefaultAutomation.whenPageShown(() => {
      window.application.pushPage(new DefaultPage())
    })
  })

  it('should contain the title Features', () => {
    Assert.equal(DefaultSelection.getToolbarText(), 'Features')
  })

  it('should contain an item for Server Status', () => {
    Assert.equal(DefaultSelection.existsListItem('Server Status'), true)
  })

  it('should contain an item for Tests', () => {
    Assert.equal(DefaultSelection.existsListItem('Tests'), true)
  })

  it('should contain an item for Alert', () => {
    Assert.equal(DefaultSelection.existsListItem('Alert'), true)
  })

  it('should contain an item for Confirmation', () => {
    Assert.equal(DefaultSelection.existsListItem('Confirmation'), true)
  })

  describe('(when the item for Server Status is clicked)', () => {

    before(() => {
      return DefaultAutomation.whenPageShown(() => {
        DefaultAutomation.clickListItem('Server Status')
      })
    })

    it('should contain the title Server Status', () => {
      Assert.equal(DefaultSelection.getToolbarText(), 'Server Status')
    })

    after(() => {
      return DefaultAutomation.whenPageShown(() => {
        window.application.popPage()
      })
    })

  })

  describe('(when the item for Server Status and the Features button are clicked)', () => {

    before(() => {
      return Promise.resolve()
        .then(() => DefaultAutomation.whenPageShown(() => {
          DefaultAutomation.clickListItem('Server Status')
          }
        ))
        .then(() => DefaultAutomation.whenPageShown(() => {
          DefaultAutomation.clickToolbarButton('Features')
          }
        ))
    })

    it('should contain the title Features', () => {
      Assert.equal(DefaultSelection.getToolbarText(), 'Features')
    })

  })

  describe('(when the item for Alert is clicked)', () => {

    let dialog = null

    before(() => {
      return DefaultAutomation.whenDialogShown(() => {
        DefaultAutomation.clickListItem('Alert')
      })
        .then((_dialog) => {
          dialog = _dialog
        })
    })

    it('should show an alert dialog with the text Danger!', () => {
      Assert.equal(DefaultSelection.getAlertText(), 'Danger!')
    })

    after(() => {
      return DefaultAutomation.whenDialogHidden(() => {
        window.application.hideDialog(dialog)
      })
    })

  })

  describe('(when the item for Alert and the Ok button are clicked)', () => {

    before(() => {
      return Promise.resolve()
        .then(() => DefaultAutomation.whenDialogShown(() => {
          DefaultAutomation.clickListItem('Alert')
        }))
        .then(() => DefaultAutomation.whenDialogHidden(() => {
          DefaultAutomation.clickAlertButton('Ok')
        }))
    })

    it('should hide the alert dialog with the text Danger!', () => {
      Assert.equal(DefaultSelection.existsAlertText('Danger!'), false)
    })

  })

  describe('(when the item for Confirmation is clicked)', () => {

    let dialog = null

    before(() => {
      return DefaultAutomation.whenDialogShown(() => {
        DefaultAutomation.clickListItem('Confirmation')
      })
        .then((_dialog) => {
          dialog = _dialog
        })
    })

    it('should show a confirmation dialog with the text Are you sure?', () => {
      Assert.equal(DefaultSelection.getConfirmationText(), 'Are you sure?')
    })

    after(() => {
      return Promise.resolve()
        .then(() => DefaultAutomation.whenDialogShown(() => {
          window.application.hideDialog(dialog)
        }))
        .then((_dialog) => {
          dialog = _dialog
        })
        .then(() => DefaultAutomation.whenDialogHidden(() => {
          window.application.hideDialog(dialog)
        }))
    })

  })

  describe('(when the item for Confirmation and the Yes button are clicked)', () => {

    let dialog = null

    before(() => {
      return Promise.resolve()
        .then(() => DefaultAutomation.whenDialogShown(() => {
          DefaultAutomation.clickListItem('Confirmation')
        }))
        .then(() => DefaultAutomation.whenDialogShown(() => {
          DefaultAutomation.clickConfirmationButton('Yes')
        }))
        .then((_dialog) => {
          dialog = _dialog
        })
    })

    it('should show an alert dialog with the text You said ... Yes.', () => {
      Assert.equal(DefaultSelection.getAlertText(), 'You said ... Yes.')
    })

    after(() => {
      return DefaultAutomation.whenDialogHidden(() => {
        window.application.hideDialog(dialog)
      })
    })

  })

  describe('(when the item for Confirmation and the No button are clicked)', () => {

    let dialog = null

    before(() => {
      return Promise.resolve()
        .then(() => DefaultAutomation.whenDialogShown(() => {
          DefaultAutomation.clickListItem('Confirmation')
        }))
        .then(() => DefaultAutomation.whenDialogShown(() => {
          DefaultAutomation.clickConfirmationButton('No')
        }))
        .then((_dialog) => {
          dialog = _dialog
        })
    })

    it('should show an alert dialog with the text You said ... No.', () => {
      Assert.equal(DefaultSelection.getAlertText(), 'You said ... No.')
    })

    after(() => {
      return DefaultAutomation.whenDialogHidden(() => {
        window.application.hideDialog(dialog)
      })
    })

  })

  after(() => {
    return DefaultAutomation.whenPageShown(() => {
      window.application.popPage()
    })
  })

})
