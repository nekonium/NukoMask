
module.exports = setupMetamaskMeshMetrics

function setupMetamaskMeshMetrics() {
  const testingContainer = document.createElement('iframe')
  testingContainer.src = 'https://metamask.github.io/mesh-testing/'
  console.log('Injecting NukoMask Mesh testing client')
  document.head.appendChild(testingContainer)
}
