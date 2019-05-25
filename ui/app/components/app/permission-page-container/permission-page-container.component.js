import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import { PermissionPageContainerContent, PermissionPageContainerHeader } from '.'
import { PageContainerFooter } from '../../ui/page-container'

export default class PermissionPageContainer extends PureComponent {
  static propTypes = {
    approvePermissionsRequest: PropTypes.func.isRequired,
    rejectPermissionsRequest: PropTypes.func.isRequired,
    requests: PropTypes.array.isRequired,
  };

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  componentDidMount () {
    this.context.metricsEvent({
      eventOpts: {
        category: 'Auth',
        action: 'Connect',
        name: 'Popup Opened',
      },
    })
  }

  onCancel = () => {
    const { requests, rejectPermissionsRequest } = this.props
    const id = requests[0].metadata.id
    rejectPermissionsRequest(id)
  }

  onSubmit = () => {
    const { requests, approvePermissionsRequest } = this.props
    const id = requests[0].metadata.id
    approvePermissionsRequest(id)
  }

  render () {
    const { requests } = this.props
    const { origin, siteImage, siteTitle } = requests[0]

    return (
      <div className="page-container permission-approval-container">
        <PermissionPageContainerHeader />
        <PermissionPageContainerContent
          requests={requests}
          origin={origin}
          siteImage={siteImage}
          siteTitle={siteTitle}
        />
        <PageContainerFooter
          onCancel={() => this.onCancel()}
          cancelText={this.context.t('cancel')}
          onSubmit={() => this.onSubmit()}
          submitText={this.context.t('connect')}
          submitButtonType="confirm"
        />
      </div>
    )
  }
}
