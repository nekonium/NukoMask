//NukoMaskの名前空間をMetaMaskと分離するための細工
{
  var nekonium_web3=undefined;
  function isundef(v){return typeof v === 'undefined'}
  if(!isundef(window.nekonium)){
    nekonium_web3=window.nekonium;
  }else if(!isundef(window.nukomask)){
    nekonium_web3=window.nukomask;
  }
  //nukomaskが既にあるときはnekoniumの挿入を行わない。
  if(!isundef(nekonium_web3)){
    throw new Error(`NukoMask detected another nukomask or nekonium.
    NukoMask will not work reliably with another web3 extension.
    This usually happens if you have two NukoMasks installed,
    or MetaMask and another web3 extension. Please remove one
    and try again.`)
  }
  if(isundef(window.nekonium)){
    window.nekonium={
      'web3':null,
      'log':null,
    }
    //互換性維持目的
    window.nukomask=window.nekonium;
  }


  /*global Web3*/
  cleanContextForImports()
  //Web3クラスの退避
  var old_Web3=window.Web3
  require('web3/dist/web3.min.js')
  const log = require('loglevel')
  const LocalMessageDuplexStream = require('post-message-stream')
  // const PingStream = require('ping-pong-stream/ping')
  // const endOfStream = require('end-of-stream')
  const setupDappAutoReload = require('./lib/auto-reload.js')
  const MetamaskInpageProvider = require('./lib/inpage-provider.js')
  //Web3クラスの復帰
  var new_Web3=window.Web3
  window.Web3=old_Web3
  restoreContextAfterImports()

  const METAMASK_DEBUG = 'GULP_METAMASK_DEBUG'
  log.setDefaultLevel(METAMASK_DEBUG ? 'debug' : 'warn')
  //
  // setup plugin communication
  //
  
  // setup background connection
  var metamaskStream = new LocalMessageDuplexStream({
    name: 'inpage_nuko',
    target: 'contentscript_nuko',
  })
  
  // compose the inpage provider
  var inpageProvider = new MetamaskInpageProvider(metamaskStream)
  

  
  var web3 = new new_Web3(inpageProvider)
  web3.setProvider = function () {
    log.debug('NukoMask - overrode web3.setProvider')
  }
  log.debug('NukoMask - injected web3')
  // export global web3, with usage-detection
  setupDappAutoReload(web3, inpageProvider.publicConfigStore)
  
  // set web3 defaultAccount
  
  inpageProvider.publicConfigStore.subscribe(function (state) {
    web3.eth.defaultAccount = state.selectedAddress
  })
  window.nekonium.log=log
  window.nekonium.Web3=new_Web3
}
//
// util
//

// need to make sure we aren't affected by overlapping namespaces
// and that we dont affect the app with our namespace
// mostly a fix for web3's BigNumber if AMD's "define" is defined...
var __define

function cleanContextForImports () {
  __define = global.define
  try {
    global.define = undefined
  } catch (_) {
    console.warn('NukoMask - global.define could not be deleted.')
  }
}

function restoreContextAfterImports () {
  try {
    global.define = __define
  } catch (_) {
    console.warn('NukoMask - global.define could not be overwritten.')
  }
}
