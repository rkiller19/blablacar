import { utils } from 'ethers'

import TokenContractAbi from '../../abi/farming/LPToken.json'

const abiInterface = new utils.Interface(TokenContractAbi)

export const lpTokenNameContractCall = (contractAddress) => ({
  abi: abiInterface,
  address: contractAddress,
  method: 'name',
})
