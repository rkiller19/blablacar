import NETWORKS from '../networks.json'

function web3Injected(e) {
  return e !== undefined
}

export async function switchNetwork(chainId) {
  const params = NETWORKS[chainId].params

  if (web3Injected(window.ethereum)) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: params.chainId }],
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params],
          })
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }
}
