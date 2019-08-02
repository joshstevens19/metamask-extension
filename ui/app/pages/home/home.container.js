import Home from './home.component'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { unconfirmedTransactionsCountSelector } from '../../selectors/confirm-transaction'
import { getCurrentEthBalance } from '../../selectors/selectors'
import {
  forceApproveProviderRequestByOrigin,
  unsetMigratedPrivacyMode,
  rejectProviderRequestByOrigin,
  showModal,
} from '../../store/actions'
import { getEnvironmentType } from '../../../../app/scripts/lib/util'
import { ENVIRONMENT_TYPE_POPUP } from '../../../../app/scripts/lib/enums'

const activeTabDappProtocols = ['http:', 'https:', 'dweb:', 'ipfs:', 'ipns:', 'ssb:']

const mapStateToProps = state => {
  const { activeTab, metamask, appState } = state
  const {
    approvedOrigins,
    dismissedOrigins,
    lostAccounts,
    suggestedTokens,
    providerRequests,
    migratedPrivacyMode,
    featureFlags: {
      privacyMode,
    } = {},
    seedPhraseBackedUp,
    tokens,
  } = metamask
  const accountBalance = getCurrentEthBalance(state)
  const { forgottenPassword, show3BoxModalAfterImport } = appState

  const isUnconnected = Boolean(
    activeTab &&
    activeTabDappProtocols.includes(activeTab.protocol) &&
    privacyMode &&
    !approvedOrigins[activeTab.origin] &&
    !dismissedOrigins[activeTab.origin]
  )
  const isPopup = getEnvironmentType(window.location.href) === ENVIRONMENT_TYPE_POPUP

  return {
    lostAccounts,
    forgottenPassword,
    suggestedTokens,
    unconfirmedTransactionsCount: unconfirmedTransactionsCountSelector(state),
    providerRequests,
    showPrivacyModeNotification: migratedPrivacyMode,
    activeTab,
    viewingUnconnectedDapp: isUnconnected && isPopup,
    shouldShowSeedPhraseReminder: !seedPhraseBackedUp && (parseInt(accountBalance, 16) > 0 || tokens.length > 0),
    isPopup,
    show3BoxModalAfterImport,
  }
}

const mapDispatchToProps = (dispatch) => ({
  unsetMigratedPrivacyMode: () => dispatch(unsetMigratedPrivacyMode()),
  forceApproveProviderRequestByOrigin: (origin) => dispatch(forceApproveProviderRequestByOrigin(origin)),
  rejectProviderRequestByOrigin: origin => dispatch(rejectProviderRequestByOrigin(origin)),
  showSeedPhraseBackupAfterOnboarding: () => dispatch(showSeedPhraseBackupAfterOnboarding()),
  show3BoxRestoreConfirmModal: () => dispatch(showModal({ name: 'THREEBOX_RESTORE_CONFIRM' }))
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Home)
