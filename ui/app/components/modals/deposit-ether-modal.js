const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const actions = require('../../actions')
const networkNames = require('../../../../app/scripts/config.js').networkNames
const ShapeshiftForm = require('../shapeshift-form')
const t = require('../../../i18n')

const DIRECT_DEPOSIT_ROW_TITLE = t('directDepositEther')
const DIRECT_DEPOSIT_ROW_TEXT = t('directDepositEtherExplainer')
const COINBASE_ROW_TITLE = t('buyCoinbase')
const COINBASE_ROW_TEXT = t('buyCoinbaseExplainer')
const SHAPESHIFT_ROW_TITLE = t('depositShapeShift')
const SHAPESHIFT_ROW_TEXT = t('depositShapeShiftExplainer')
const FAUCET_ROW_TITLE = t('testFaucet')
const facuetRowText = (networkName) => {
  return t('getEtherFromFaucet', [networkName])
}

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
function DepositEtherModal () {
  Component.call(this)

  this.state = {
    buyingWithShapeshift: false,
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DepositEtherModal)

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
  const networkName = networkNames[network]+'('+network+')'

  return h('div.page-container.page-container--full-width.page-container--full-height', {}, [

    h('div.page-container__header', [

      h('div.page-container__title', [t('depositEther')]),

      h('div.page-container__subtitle', [
        t('needEtherInWallet'),
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
        buttonLabel: t('viewAccount'),
        onButtonClick: () => this.goToAccountDetailsModal(),
        hide: buyingWithShapeshift,
      }),

      this.renderRow({
        logo: h('i.fa.fa-tint.fa-2x'),
        title: FAUCET_ROW_TITLE,
        text: facuetRowText(networkName),
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
