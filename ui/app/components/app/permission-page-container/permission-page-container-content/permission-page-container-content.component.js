import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Identicon from '../../../ui/identicon'
import AccountDropdownMini from '../../../ui/account-dropdown-mini'

export default class PermissionPageContainerContent extends PureComponent {

  static propTypes = {
    metadata: PropTypes.object.isRequired,
    selectedPermissions: PropTypes.object.isRequired,
    permissionsDescriptions: PropTypes.object.isRequired,
    onPermissionToggle: PropTypes.func.isRequired,
    selectedAccount: PropTypes.object.isRequired,
    onAccountSelect: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  renderPermissionApprovalVisual = () => {
    const {
      metadata, selectedAccount, onAccountSelect
    } = this.props

    return (
      <div className="permission-approval-visual">
        <section>
          {metadata.site.icon ? (
            <img
              className="permission-approval-visual__identicon"
              src={metadata.site.icon}
            />
          ) : (
            <i className="permission-approval-visual__identicon--default">
              {metadata.site.name.charAt(0).toUpperCase()}
            </i>
          )}
          <h1>{metadata.site.name}</h1>
          <h2>{metadata.origin}</h2>
        </section>
        <span className="permission-approval-visual__check" />
        <section>
          <Identicon
            className="permission-approval-visual__identicon"
            address={selectedAccount.address}
            diameter={64}
          />
          <AccountDropdownMini
            className="permission-approval-container__content"
            onSelect={onAccountSelect}
            selectedAccount={selectedAccount}
          />
        </section>
      </div>
    )
  }

  renderRequestedPermissions () {
    const {
      onPermissionToggle, selectedPermissions, permissionsDescriptions
    } = this.props

    const items = Object.keys(selectedPermissions).map((methodName) => {

      if (!permissionsDescriptions[methodName]) {
        // TODO:lps:review what do with this? Will this ever happen?
        console.warn('Unknown permission requested.')
      }
      const description = permissionsDescriptions[methodName] || methodName

      return (
        <li key={methodName}>
          <input
            type="checkbox"
            checked={selectedPermissions[methodName]}
            onChange={onPermissionToggle(methodName)}
          />
          <label>{description}</label>
        </li>
      )
    })

    return (
      <ul className="permission-approval-container__content__requested">
        {items}
      </ul>
    )
  }

  render () {
    const { metadata } = this.props
    const { t } = this.context

    // TODO:lps change the learnMore link
    return (
      <div className="permission-approval-container__content">
        <section>
          <h2>{t('permissionsRequest')}</h2>
          {this.renderPermissionApprovalVisual()}
          <section>
            <h1>{metadata.site.name}</h1>
            <h2>{'Would like to:'}</h2>
            {this.renderRequestedPermissions()}
            <br/>
            <a
              href="https://metamask.io"
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
