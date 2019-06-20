// Methods that do not require any permissions to use:
const SAFE_METHODS = require('../lib/permissions-safe-methods.json')
const RpcCap = require('json-rpc-capabilities-middleware').CapabilitiesController

class PermissionsController {

  constructor ({ openPopup, closePopup, getAccounts } = {}, restoredState) {
    this._openPopup = openPopup
    this._closePopup = closePopup
    this.getAccounts = getAccounts

    this._initializePermissions(restoredState)
  }

  createMiddleware (options) {
    return this.permissions.providerMiddlewareFunction.bind(this.permissions, options)
  }

  async approvePermissionsRequest (approved) {
    const id = approved.metadata.id
    const approval = this.pendingApprovals[id]
    const res = approval.res
    res(approved.permissions)
    this._closePopup && this._closePopup()
    delete this.pendingApprovals[id]
  }

  async rejectPermissionsRequest (id) {
    const approval = this.pendingApprovals[id]
    const rej = approval.rej
    rej(false)
    this._closePopup && this._closePopup()
    delete this.pendingApprovals[id]
  }

  async selectAccountsFor (domain, opts) {
    const accounts = await this.getAccounts()
    const approved = accounts.filter(acct => confirm(`Would you like to reveal account ${acct}?`))
    return {
      caveats: [{
        type: 'static',
        value: approved,
      }],
    }
  }

   /*
   * A convenience method for retrieving a login object
   * or creating a new one if needed.
   *
   * @param {string} origin = The origin string representing the domain.
   */
  _initializePermissions (restoredState) {
    this.testProfile = {
      name: 'Dan Finlay',
    }

    this.pendingApprovals = {}

    this.permissions = new RpcCap({

       // Supports passthrough methods:
      safeMethods: SAFE_METHODS,

       // optional prefix for internal methods
      methodPrefix: 'wallet_',

      restrictedMethods: {

        'eth_accounts': {
          description: 'View Ethereum accounts',
          method: (req, res, next, end) => {
            this.getAccounts()
            .then((accounts) => {
              res.result = accounts
              end()
            })
            .catch((reason) => {
              res.error = reason
              end(reason)
            })
          },
        },

        // Restricted methods themselves are defined as
        // json-rpc-engine middleware functions.
        'readYourProfile': {
          description: 'Read from your profile',
          method: (_req, res, _next, end) => {
            res.result = this.testProfile
            end()
          },
        },
        'writeToYourProfile': {
          description: 'Write to your profile.',
          method: (req, res, _next, end) => {
            const [ key, value ] = req.params
            this.testProfile[key] = value
            res.result = this.testProfile
            return end()
          },
        },
      },

      /**
       * A promise-returning callback used to determine whether to approve
       * permissions requests or not.
       *
       * Currently only returns a boolean, but eventually should return any specific parameters or amendments to the permissions.
       *
       * @param {string} domain - The requesting domain string
       * @param {string} req - The request object sent in to the `requestPermissions` method.
       * @returns {Promise<bool>} approved - Whether the user approves the request or not.
       */
      requestUserApproval: async (options) => {
        const { metadata } = options
        const { id } = metadata

        // const restricted = this.permissions.restrictedMethods
        // const descriptions = Object.keys(opts).map(method => restricted[method].description)

        // const message = `The site ${siteTitle} at ${origin} would like permission to:\n - ${descriptions.join('\n- ')}`
        this._openPopup && this._openPopup()

        return new Promise((res, rej) => {
          this.pendingApprovals[id] = { res, rej }
        },
        // TODO: This should be persisted/restored state.
        {})

         // TODO: Attenuate requested permissions in approval screen.
        // Like selecting the account to display.
      },
    }, restoredState)
  }

}

module.exports = PermissionsController
