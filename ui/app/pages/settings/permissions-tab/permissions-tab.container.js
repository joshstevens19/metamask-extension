import PermissionsTab from './permissions-tab.component'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  showModal,
} from '../../../store/actions'

const mapStateToProps = state => {
  const { appState: { warning }, metamask } = state
  // const {
  // } = metamask

  return {
    warning,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showClearPermissionsModal: () => dispatch(showModal({ name: 'CLEAR_PERMISSIONS' })),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(PermissionsTab)
