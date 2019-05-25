import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import Identicon from '../../../ui/identicon'

export default class PermissionPageContainerContent extends PureComponent {
  static propTypes = {
    requests: PropTypes.array.isRequired,
    selectedIdentity: PropTypes.object.isRequired,
    permissionsDescriptions: PropTypes.array.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
  };

  renderConnectVisual = () => {
    const { requests, selectedIdentity } = this.props
    const { origin, siteImage, siteTitle } = requests[0].metadata

    return (
      <div className="permission-approval-visual">
        <section>
          {siteImage ? (
            <img
              className="permission-approval-visual__identicon"
              src={siteImage}
            />
          ) : (
            <i className="permission-approval-visual__identicon--default">
              {siteTitle.charAt(0).toUpperCase()}
            </i>
          )}
          <h1>{siteTitle}</h1>
          <h2>{origin}</h2>
        </section>
        <span className="permission-approval-visual__check" />
        <section>
          <Identicon
            className="permission-approval-visual__identicon"
            address={selectedIdentity.address}
            diameter={64}
          />
          <h1>{selectedIdentity.name}</h1>
        </section>
      </div>
    )
  }

  renderRequestedPermissions () {
    const { requests, permissionsDescriptions } = this.props
    const { t } = this.context

    const items = requests.map((req) => {
      const matchingFuncs = permissionsDescriptions.filter(
        perm => perm.method === req.options.method
      )
      const match = matchingFuncs[0]
      if (!match) { // TODO: handle gracefully
        throw new Error('Requested unknown permission: ' + req.options.method)
      }
      return (
        <li
          className="permission-requested"
          key={req.options.method}
          >
          {match.description}
        </li>
      )
    })

    return (
      <ul className="permissions-requested">
        <h4>{t('permissionsRequests')}</h4>
        {items}
      </ul>
    )
  }

  render () {
    const { requests } = this.props
    const { siteTitle } = requests[0].metadata
    const { t } = this.context

    return (
      <div className="permission-approval-container__content">
        <section>
          <h2>{t('connectRequest')}</h2>
          {this.renderConnectVisual()}
          <h1>{t('permissionsRequests', [siteTitle])}</h1>
          <section>
            <br/>
            {this.renderRequestedPermissions()}
            <br/>
            <a
              href="https://medium.com/metamask/introducing-privacy-mode-42549d4870fa"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('learnMore')}.
            </a>
          </section>
        </section>
        <section className="secure-badge">
          <img src="/images/mm-secure.svg" />
        </section>
      </div>
    )
  }
}