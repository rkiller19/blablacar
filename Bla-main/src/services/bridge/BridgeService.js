import { ethers } from 'ethers'

import DAO1Abi from '../../abi/staking/DAO1.json'
import BridgeAbi from '../../abi/bridge/Bridge.json'
import NetworksData from '../../networks.json'

const DAO1Address = NetworksData[1].tokenContract
const BridgeAddress = NetworksData[1].bridgeContract
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const DAO1Signer = new ethers.Contract(DAO1Address, DAO1Abi, signer)
const BridgeSigner = new ethers.Contract(BridgeAddress, BridgeAbi, signer)

export async function getBalanceAndAllowance() {
  const signerAddress = await signer.getAddress()
  const tokensBalance = (await DAO1Signer.balanceOf(signerAddress)).toString()
  const allowance = (
    await DAO1Signer.allowance(signerAddress, BridgeAddress)
  ).toString()

  return { tokensBalance, allowance }
}

export async function approve() {
  return DAO1Signer.approve(BridgeAddress, ethers.constants.MaxUint256)
}

export async function bridge(amount) {
  const signerAddress = await signer.getAddress()

  return BridgeSigner.outboundTransfer(signerAddress, amount)
}
