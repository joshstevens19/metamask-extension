import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import ToggleButton from '../../../components/ui/toggle-button'
// import { REVEAL_SEED_ROUTE } from '../../../helpers/constants/routes'
import Button from '../../../components/ui/button'

export default class PermissionsTab extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    showClearPermissionsModal: PropTypes.func,
  }

  renderClearPermissions () {
    const { t } = this.context
    const { showClearPermissionsModal } = this.props
    return (
      <div className="settings-page__content-row">
        <div className="settings-page__content-item">
          <span>{ t('permissionsData') }</span>
          <span className="settings-page__content-description">
            { t('permissionsDataDescription') }
          </span>
        </div>
        <div className="settings-page__content-item">
          <div className="settings-page__content-item-col">
            <Button
              type="warning"
              large
              className="settings-tab__button--orange"
              onClick={event => {
                event.preventDefault()
                showClearPermissionsModal()
              }}
            >
              { t('clearPermissionsData') }
            </Button>
          </div>
        </div>
      </div>
    )
  }

  renderContent () {
    const { warning } = this.props

    return (
      <div className="settings-page__body">
        { warning && <div className="settings-tab__error">{ warning }</div> }
        { this.renderClearPermissions() }
      </div>
    )
  }

  render () {
    return this.renderContent()
  }
}
