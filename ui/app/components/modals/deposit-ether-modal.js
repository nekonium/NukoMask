const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const actions = require('../../actions')
const { getNetworkDisplayName } = require('../../../../app/scripts/controllers/network/util')
const ShapeshiftForm = require('../shapeshift-form')

let DIRECT_DEPOSIT_ROW_TITLE
let DIRECT_DEPOSIT_ROW_TEXT
let COINBASE_ROW_TITLE
let COINBASE_ROW_TEXT
let SHAPESHIFT_ROW_TITLE
let SHAPESHIFT_ROW_TEXT
let FAUCET_ROW_TITLE

function mapStateToProps (state) {
  return {
    network: state.metamask.network,
    address: state.metamask.selectedAddress,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    // toCoinbase: (address) => {
    //   dispatch(actions.buyEth({ network: '1', address, amount: 0 }))
    // },
    hideModal: () => {
      dispatch(actions.hideModal())
    },
    hideWarning: () => {
      dispatch(actions.hideWarning())
    },
    showAccountDetailModal: () => {
      dispatch(actions.showModal({ name: 'ACCOUNT_DETAILS' }))
    },
    toFaucet: network => dispatch(actions.buyEth({ network })),
  }
}

inherits(DepositEtherModal, Component)
function DepositEtherModal (props, context) {
  Component.call(this)

  // need to set after i18n locale has loaded
  DIRECT_DEPOSIT_ROW_TITLE = context.t('directDepositEther')
  DIRECT_DEPOSIT_ROW_TEXT = context.t('directDepositEtherExplainer')
  COINBASE_ROW_TITLE = context.t('buyCoinbase')
  COINBASE_ROW_TEXT = context.t('buyCoinbaseExplainer')
  SHAPESHIFT_ROW_TITLE = context.t('depositShapeShift')
  SHAPESHIFT_ROW_TEXT = context.t('depositShapeShiftExplainer')
  FAUCET_ROW_TITLE = context.t('testFaucet')

  this.state = {
    buyingWithShapeshift: false,
  }
}

DepositEtherModal.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DepositEtherModal)


DepositEtherModal.prototype.facuetRowText = function (networkName) {
  return this.context.t('getEtherFromFaucet', [networkName])
}

DepositEtherModal.prototype.renderRow = function ({
  logo,
  title,
  text,
  buttonLabel,
  onButtonClick,
  hide,
  className,
  hideButton,
  hideTitle,
  onBackClick,
  showBackButton,
  innerHtml,
}) {
  if (hide) {
    return null
  }

  return h('div', {
      className: className || 'deposit-ether-modal__buy-row',
    }, [

    onBackClick && showBackButton && h('div.deposit-ether-modal__buy-row__back', {
      onClick: onBackClick,
    }, [

      h('i.fa.fa-arrow-left.cursor-pointer'),

    ]),

    h('div.deposit-ether-modal__buy-row__logo-container', [logo]),

      h('div.deposit-ether-modal__buy-row__description', [

        !hideTitle && h('div.deposit-ether-modal__buy-row__description__title', [title]),

        h('div.deposit-ether-modal__buy-row__description__text', [text]),

      ]),

      !hideButton && h('div.deposit-ether-modal__buy-row__button', [
        h('button.btn-primary--lg.deposit-ether-modal__deposit-button', {
          onClick: onButtonClick,
        }, [buttonLabel]),
      ]),
      innerHtml && h('', [innerHtml]),
  ])
}

DepositEtherModal.prototype.render = function () {
  const { network, toCoinbase, address, toFaucet } = this.props
  const { buyingWithShapeshift } = this.state

  const isTestNetwork = ['3', '4', '42'].find(n => n === network)
  const networkName = getNetworkDisplayName(network)

  return h('div.page-container.page-container--full-width.page-container--full-height', {}, [

    h('div.page-container__header', [

      h('div.page-container__title', [this.context.t('depositEther')]),

      h('div.page-container__subtitle', [
        this.context.t('needEtherInWallet'),
      ]),

      h('div.page-container__header-close', {
        onClick: () => {
          this.setState({ buyingWithShapeshift: false })
          this.props.hideWarning()
          this.props.hideModal()
        },
      }),

    ]),

    h('.page-container__content', {}, [

      this.renderRow({
        logo: h('img.deposit-ether-modal__buy-row__eth-logo', { src: '../../../images/3_64.png' }),
        title: DIRECT_DEPOSIT_ROW_TITLE,
        text: DIRECT_DEPOSIT_ROW_TEXT,
        buttonLabel: this.context.t('viewAccount'),
        onButtonClick: () => this.goToAccountDetailsModal(),
        hide: buyingWithShapeshift,
      }),

      this.renderRow({
        logo: h('i.fa.fa-tint.fa-2x'),
        title: FAUCET_ROW_TITLE,
        text: this.facuetRowText(networkName),
        buttonLabel: 'Get Nekonium',
        onButtonClick: () => toFaucet(network),
        hide: buyingWithShapeshift,
        hideButton: true,
        innerHtml:h("ul",{},[
          h('li',{},h('a',{href:'http://nuko.oldbeyond.com/#/faucet'},'http://nuko.oldbeyond.com/#/faucet')),
          h('li',{},h('a',{href:'http://namuyan.dip.jp/nekoniumFaucet.php'},' http://namuyan.dip.jp/nekoniumFaucet.php')),
          h('li',{},h('a',{href:'https://faucet.nekonium.net/'},'https://faucet.nekonium.net/')),
          h('li',{},h('a',{href:'http://faucet.nekonium.network/'},'http://faucet.nekonium.network/')),
        ]),
      },),



        buyingWithShapeshift && h(ShapeshiftForm),


    ]),
  ])
}

DepositEtherModal.prototype.goToAccountDetailsModal = function () {
  this.props.hideWarning()
  this.props.hideModal()
  this.props.showAccountDetailModal()
}
