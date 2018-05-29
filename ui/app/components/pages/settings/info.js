const { Component } = require('react')
const PropTypes = require('prop-types')
const h = require('react-hyperscript')

class Info extends Component {
  constructor (props) {
    super(props)

    this.state = {
      version: global.platform.getVersion(),
    }
  }

  renderLogo () {
    return (
      h('div.settings__info-logo-wrapper', [
        h('img.settings__info-logo', { src: 'images/icon-64.png' }),
      ])
    )
  }

 
  renderInfoLinks () {
    return (
      h('div.settings__content-item.settings__content-item--without-height', [
        h('div.settings__info-link-header', this.context.t('links')),
        h('div.settings__info-link-item', [
          h('a', {
            href: 'https://nekonium.github.io/',
            target: '_blank',
          }, [
            h('span.settings__info-link', 'Nekonium project'),
          ]),
        ]),
        h('div.settings__info-link-item', [
          h('a', {
            href: 'https://github.com/nekonium/NukoMask',
            target: '_blank',
          }, [
            h('span.settings__info-link', 'Github'),
          ]),
        ]),
        h('hr.settings__info-separator'),
        h('div.settings__info-link-item', [
          h('a', {
            href: 'https://metamask.io/',
            target: '_blank',
          }, [
            h('span.settings__info-link', 'MetaMask Website'),
          ]),
        ]),        
      ])
    )
  }
  renderInfoContent () {
    const version = global.platform.getVersion()

    return (
      h('div.settings__content', [
        h('div.settings__content-row', [
          h('div.settings__content-item.settings__content-item--without-height', [
            this.renderLogo(),
            h('div.settings__info-item', [
              h('div.settings__info-version-header', 'NukoMask'),
              h('div.settings__info-version-number', `version ${version}`),
            ]),
            h('div.settings__info-item', [
              h(
                'div.settings__info-about',
                this.context.t('builtInCalifornia')
              ),
            ]),
            h('div.settings__info-item', [
              h('div.settings__info-version-header', 'MetaMask'),
            ]),
            h('div.settings__info-item', [
              h(
                'div.settings__info-about',
                'MetaMask is designed and built in California.\nThis is a bridge that allows you to visit the distributed web in your browser. It allows you to run Ethereum dApps right in your browser without running a full Ethereum node.',
              ),
            ]),
          ]),
          this.renderInfoLinks(),
        ]),
      ])
    )
  }
  render () {
    return (
      this.renderInfoContent()
      // h('div.settings__content', [
      //   h('div.settings__content-row', [
      //     h('div.settings__content-item.settings__content-item--without-height', [
      //       this.renderLogo(),
      //       h('div.settings__info-item', [
      //         h('div.settings__info-version-header', 'MetaMask Version'),
      //         h('div.settings__info-version-number', this.state.version),
      //       ]),
      //       h('div.settings__info-item', [
      //         h(
      //           'div.settings__info-about',
      //           this.context.t('builtInCalifornia')
      //         ),
      //       ]),
      //     ]),
      //     this.renderInfoLinks(),
      //   ]),
      // ])
    )
  }



  
}

Info.propTypes = {
  tab: PropTypes.string,
  metamask: PropTypes.object,
  setCurrentCurrency: PropTypes.func,
  setRpcTarget: PropTypes.func,
  displayWarning: PropTypes.func,
  revealSeedConfirmation: PropTypes.func,
  warning: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  t: PropTypes.func,
}

Info.contextTypes = {
  t: PropTypes.func,
}

module.exports = Info
