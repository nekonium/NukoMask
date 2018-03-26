const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const actions = require('../../ui/app/actions')

module.exports = connect(mapStateToProps)(InfoScreen)

function mapStateToProps (state) {
  return {}
}

inherits(InfoScreen, Component)
function InfoScreen () {
  Component.call(this)
}

InfoScreen.prototype.render = function () {
  const state = this.props
  const version = global.platform.getVersion()

  return (
    h('.flex-column.flex-grow', {
      style: {
        maxWidth: '400px',
      },
    }, [

      // subtitle and nav
      h('.section-title.flex-row.flex-center', [
        h('i.fa.fa-arrow-left.fa-lg.cursor-pointer', {
          onClick: (event) => {
            state.dispatch(actions.goHome())
          },
        }),
        h('h2.page-subtitle', 'Info'),
      ]),

      // main view
      h('.flex-column.flex-justify-center.flex-grow.select-none', [
        h('.flex-space-around', {
          style: {
            padding: '20px',
          },
        }, [
          // current version number

          h('.info.info-gray', [
            h('div', 'NUKOMASK'),
            h('div', {
              style: {
                marginBottom: '10px',
              },
            }, `Version: ${version}`),
          ]),
          h('div', {
            style: {
              marginBottom: '5px',
            }},
            [
              h('div', ["NukoMask is forked from MetaMask."
              ]),
              h('hr'),
              h('div', [
                h('a', {
                  href: 'https://nekonium.github.io/',
                  target: '_blank',
                }, [
                  h('div.info', 'Nekonium Project'),
                ]),
              ]),
              h('div', [
                h('a', {
                  href: 'https://github.com/nekonium/NukoMask',
                  target: '_blank',
                }, [
                  h('div.info', 'Github'),
                ]),
              ]),
              h('div', [
                h('a', {
                  href: 'https://discordapp.com/invite/C8mJg44',
                  target: '_blank',
                }, [
                  h('div.info', 'Discord channel'),
                ]),
              ]),              
            ]
          ),

          h('hr', {
            style: {
              margin: '10px 0 ',
              width: '7em',
            },
          }),

          h('div', {
            style: {
              paddingLeft: '30px',
            }},
            [
              h('div', [
                h('a.info', {
                  href: 'https://metamask.io',
                  target: '_blank',
                }, 'MetaMask'),
              ]),
            ]),
        ]),
      ]),
    ])
  )
}

InfoScreen.prototype.navigateTo = function (url) {
  global.platform.openWindow({ url })
}

