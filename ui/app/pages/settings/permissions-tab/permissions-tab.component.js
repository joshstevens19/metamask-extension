import React, { Component } from 'react'
import PropTypes from 'prop-types'
import deepEqual from 'fast-deep-equal'
import Button from '../../../components/ui/button'
// maybe the below instead of checkboxes, some day
// import ToggleButton from '../../../components/ui/toggle-button'

export default class PermissionsTab extends Component {

  static propTypes = {
    warning: PropTypes.string,
    permissions: PropTypes.object.isRequired, 
    permissionsDescriptions: PropTypes.object.isRequired,
    removePermissionsFor: PropTypes.func.isRequired,
    showClearPermissionsModal: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      permissions: this.getPermissionsState(props)
    }
  }

  componentDidUpdate () {
    const newState = this.getPermissionsState(this.props)
    // if permissions have been added or removed, reset state
    // does not take caveat changes into account, but we don't yet allow them
    // to change after creation
    if (!deepEqual(Object.keys(this.state.permissions), Object.keys(newState))) {
      this.setState({ permissions: newState })
    }
  }

  getPermissionsState (props) {
    const { permissions } = props
    return Object.keys(permissions).reduce((acc, domain) => {
      permissions[domain].permissions.forEach(perm => {
        acc[perm.id] = {
          domain,
          methodName: perm.parentCapability,
          selected: true,
        }
      })
      return acc
    }, {})
  }

  onPermissionToggle = id => () => {
    this.setState({
      permissions: {
        ...this.state.permissions,
        [id]: {
          ...this.state.permissions[id],
          selected: !this.state.permissions[id].selected,
        }
      }
    })
  }

  updatePermissions () {
    this.props.removePermissionsFor(
      Object.values(this.state.permissions).reduce((acc, permState) => {
        if (!permState.selected) {
          if (!acc[permState.domain]) acc[permState.domain] = []
          acc[permState.domain].push(permState.methodName)
        }
        return acc
      }, {})
    )
  }

  renderPermissions () {
    const { t } = this.context
    const hasPermissions = Object.keys(this.props.permissions).length > 0
    return (
      <div className="settings-page__content-row">
        <div className="settings-page__content-item">
          <span>{ t('permissionsData') }</span>
          <span className="settings-page__content-description">
            { t('permissionsDataDescription') }
          </span>
        </div>
        <div className="settings-page__content-item">
          {
            hasPermissions
            ? this.renderPermissionsList()
            : t('permissionsDataEmpty')
          }
        </div>
        <div className="settings-page__content-item">
          <div className="settings-page__content-item-col">
            <Button
              type="warning"
              large
              className="settings-tab__button--orange"
              disabled={!hasPermissions}
              onClick={event => {
                event.preventDefault()
                this.updatePermissions()
              }}
            >
              { t('updatePermissionsData') }
            </Button>
          </div>
        </div>
      </div>
    )
  }

  renderPermissionsList () {
    const { permissions, permissionsDescriptions } = this.props
    return (
      <ul>
        {
          Object.keys(permissions).map(domain => {
            if (permissions[domain].permissions.length === 0) return null
            return (
              <li key={domain}>
                {domain}
                <ul>
                  {
                    permissions[domain].permissions.map(perm => {
                      return this.renderPermissionsListItem(
                        perm, permissionsDescriptions[perm.parentCapability]
                      )
                    })
                  }
                </ul>
              </li>
            )
          })
        }
      </ul>
    )
  }

  renderPermissionsListItem (permission, description) {
    return (
      <li key={permission.id}>
        <input
          type="checkbox"
          checked={this.state.permissions[permission.id].selected}
          onChange={this.onPermissionToggle(permission.id)}
        />
        <label>{description || permission.parentCapability}</label>
        {
          permission.caveats && permission.caveats.length > 0
          ? this.renderCaveatList(permission)
          : null
        }
      </li>
    )
  }

  renderCaveatList (permission) {
    return (
      <ul>
        {
          permission.caveats.map((caveat, i) => (
            <li key={i}>
              {caveat.type + ': ' + JSON.stringify(caveat.value)}
            </li>
          ))
        }
      </ul>
    )
  }

  renderClearPermissions () {
    const { t } = this.context
    const { showClearPermissionsModal } = this.props
    return (
      <div className="settings-page__content-row">
        <div className="settings-page__content-item">
          <span>{ t('clearPermissionsData') }</span>
          <span className="settings-page__content-description">
            { t('clearPermissionsDataDescription') }
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

  render () {
    const { warning } = this.props

    return (
      <div className="settings-page__body">
        { warning && <div className="settings-tab__error">{ warning }</div> }
        { this.renderPermissions() }
        { this.renderClearPermissions() }
      </div>
    )
  }
}
