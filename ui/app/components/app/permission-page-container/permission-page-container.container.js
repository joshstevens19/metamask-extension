import { connect } from 'react-redux'
import PermissionPageContainer from './permission-page-container.component'
import { getSelectedIdentity, getPermissionsDescriptions } from '../../../selectors/selectors'

const mapStateToProps = (state) => {
  return {
    selectedIdentity: getSelectedIdentity(state),
    permissionsDescriptions: getPermissionsDescriptions(state),
  }
}

export default connect(mapStateToProps)(PermissionPageContainer)
