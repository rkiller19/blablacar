import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BigNumber } from '@ethersproject/bignumber'
import {
  useContractCalls,
  useEthers,
  useTokenBalance,
  useContractFunction,
} from '@usedapp/core'
import { utils } from 'ethers'

import StakeLogo2 from '../assets/Logo.png'
import { StakeCards } from '../components'
import {
  errorModalAction,
  modalAction,
  nftModalAction,
  unStakeModalAction,
} from '../actions/modalAction'
import {
  rewardRateContractCall,
  totalStakersContractCall,
  ssgtStakedContractCall,
  totalNftTokensOfUserContractCall,
  ssgtTotalEarnedContractCall,
  totalStakedTokenContractCall,
  contract,
  depositSSGTFunction,
  withdrawSSGTFunction,
  withdrawWithNFTFunction,
  harvestFunction,
} from '../services/ssgt/StakingContractService'
import {
  totalStakedContractCall,
  tokenContract,
  allowanceContractCall,
  approveAllowanceFunction,
} from '../services/ssgt/TokenContractService'
import {
  nftOwnedContractCall,
  isApprovedForNftContractCall,
  nftContract,
  getTokenListContractCall,
  setApproveForNftFunction,
} from '../services/ssgt/NftContractService'

import {
  harvestingFailed,
  harvestingInProgress,
  harvestingSuccess,
  nftClaimFailed,
  nftClaimInProgress,
  nftClaimSucess,
  stakingFailed,
  stakingInProgress,
  stakingSucess,
  unStakingFailed,
  unStakingInProgress,
  unStakingSucess,
} from '../actions/stakingAction'

const Ssgt = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state.modalReducer.title)
  const { account } = useEthers()
  const [rewardRate, setRewardRate] = useState(0)
  const [totalStakers, setTotalStakers] = useState(0)
  const [totalStaked, setTotalStaked] = useState(0)
  const [ssgtStaked, setSsgtStaked] = useState(0)
  const [ssgtEarned, setSsgtEarned] = useState(0)
  const [ownedNFT, setOwnedNFT] = useState(0)
  const [totalNFTTokensOfUser, setTotalNFTTokensOfUser] = useState(0)
  const [isApprovedForNftClaim, setIsApprovedForNftClaim] = useState(false)
  const [allowance, setAllowance] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)
  const [walletAmount, setWalletAmount] = useState('')
  const [usdRate, setUsdRate] = useState(0)
  const [tokenList, setTokenList] = useState([])
  const [selectedTokenList, setSelectedTokenList] = useState([])

  const formatToPercentage = (rewardRateValue) => {
    return (rewardRateValue / 100).toFixed(2).replace(/[.,]00$/, '')
  }

  const userBalance = useTokenBalance(
    process.env.REACT_APP_SSGT_TOKEN_ADDRESS,
    account,
  )
  useEffect(() => {
    setWalletBalance(
      userBalance ? Math.round(utils.formatEther(userBalance)) : 0,
    )
  }, [userBalance])

  useEffect(async () => {
    const usdrate = await getUSDRate()
    setUsdRate(usdrate)
  }, [])

  const getUSDRateUrl = () => {
    return 'https://api.coingecko.com/api/v3/simple/price?ids=safeswap&vs_currencies=USD'
  }

  const getUSDRate = async () => {
    const url = getUSDRateUrl()
    const response = await fetch(url)
    const jsonData = await response.json()
    return jsonData.safeswap.usd
  }

  const [
    rewardRateCall,
    totalStakersCall,
    totalStakedCall,
    ssgtStakedCall,
    totalNftTokensOfUserCall,
    nftOwnedCall,
    ssgtEarnedCall,
    isApprovedForNftCall,
    allowanceCall,
    totalStakedTokenCall,
    getTokenListCall,
  ] = useContractCalls([
    rewardRateContractCall,
    totalStakersContractCall,
    totalStakedContractCall,
    ssgtStakedContractCall(account),
    totalNftTokensOfUserContractCall(account),
    nftOwnedContractCall(account),
    ssgtTotalEarnedContractCall(account),
    isApprovedForNftContractCall(account),
    allowanceContractCall(account),
    totalStakedTokenContractCall,
    getTokenListContractCall(account),
  ])

  useEffect(() => {
    setRewardRate(
      rewardRateCall ? formatToPercentage(parseInt(rewardRateCall)) : 0,
    )
    setTotalStakers(totalStakersCall ? parseInt(totalStakersCall) : 0)
    setTotalStaked(
      totalStakedTokenCall
        ? utils.formatUnits(totalStakedTokenCall[0]._hex, 18)
        : 0,
    )
    setSsgtStaked(
      ssgtStakedCall ? utils.formatUnits(ssgtStakedCall[0]._hex, 18) : 0,
    )
    setTotalNFTTokensOfUser(
      totalNftTokensOfUserCall
        ? utils.formatUnits(totalNftTokensOfUserCall[0]._hex, 18)
        : 0,
    )
    setOwnedNFT(nftOwnedCall ? parseInt(nftOwnedCall) : 0)
    setSsgtEarned(
      ssgtEarnedCall ? utils.formatUnits(ssgtEarnedCall[0]._hex, 18) : 0,
    )
    setIsApprovedForNftClaim(
      isApprovedForNftCall ? isApprovedForNftCall[0] : false,
    )
    setAllowance(
      allowanceCall ? utils.formatUnits(allowanceCall[0]._hex, 'ether') : 0,
    )
    updateTokenIds(getTokenListCall ? getTokenListCall[0] : [])
  }, [
    rewardRateCall,
    totalStakersCall,
    totalStakedCall,
    nftOwnedCall,
    ssgtEarnedCall,
    ssgtStakedCall,
    totalNftTokensOfUserCall,
    allowanceCall,
    totalStakedTokenCall,
    getTokenListCall,
  ])

  const {
    state: depositSSGTFunctionState,
    send: depositSSGT,
  } = useContractFunction(contract, depositSSGTFunction)
  const {
    state: approveAllowanceFunctionState,
    send: sendApproveAllowance,
  } = useContractFunction(tokenContract, approveAllowanceFunction)
  const {
    state: withdrawSSGTFunctionState,
    send: withdrawSSGT,
  } = useContractFunction(contract, withdrawSSGTFunction)
  const {
    state: setApproveForNftFunctionState,
    send: setApproveForNft,
  } = useContractFunction(nftContract, setApproveForNftFunction)
  const {
    state: withdrawWithNFTFunctionState,
    send: withdrawWithNFT,
  } = useContractFunction(contract, withdrawWithNFTFunction)
  const { state: harvestFunctionState, send: harvest } = useContractFunction(
    contract,
    harvestFunction,
  )

  const updateWalletAmount = (inputAmount) => {
    setWalletAmount(inputAmount)
  }

  const updateTokenIds = async (tokenIds) => {
    if (tokenIds.length > 0 && tokenList.length === 0) {
      const temp = await getConvertedIds(tokenIds)
      setTokenList(temp)
    }
  }

  const getConvertedIds = (tokenIds) => {
    const tokenIdsConverted = tokenIds.map((tokenId) => {
      return parseInt(tokenId)
    })
    return tokenIdsConverted
  }

  const updateTokenIdList = (e) => {
    const isChecked = e.target.checked
    const itemValue = e.target.value
    if (isChecked) {
      setSelectedTokenList([...selectedTokenList, itemValue])
    } else {
      const removeItem = selectedTokenList.filter((item) => item !== itemValue)
      setSelectedTokenList(removeItem)
    }
  }

  const checkAndUnStakeSSGT = () => {
    if (walletAmount > 0) {
      dispatch(unStakeModalAction(false, selector))
      dispatch(unStakingInProgress())
      withdrawSSGT(utils.parseUnits(walletAmount, 18))
    }
  }

  useEffect(() => {
    if (
      withdrawSSGTFunctionState &&
      withdrawSSGTFunctionState.status === 'Success'
    ) {
      setWalletAmount('')
      dispatch(unStakingSucess())
    } else if (
      withdrawSSGTFunctionState &&
      withdrawSSGTFunctionState.status === 'Exception'
    ) {
      setWalletAmount('')
      dispatch(unStakingFailed())
      dispatch(errorModalAction(true, withdrawSSGTFunctionState.errorMessage))
    }
  }, [withdrawSSGTFunctionState])

  const checkAndStakeSSGT = () => {
    // Check allowance, if allowance > 0 && < entered amount then proceed
    if (walletAmount <= walletBalance) {
      if (parseFloat(allowance) > 0 && parseFloat(allowance) > walletAmount) {
        dispatch(stakingInProgress())
        dispatch(modalAction(false, selector))
        stakeSSGT()
      } else {
        // Else call approve allowance
        dispatch(stakingInProgress())
        dispatch(modalAction(false, selector))
        sendApproveAllowance(
          process.env.REACT_APP_SSGT_CONTRACT_ADDRESS,
          BigNumber.from(2)
            .pow(256)
            .sub(1),
        )
      }
    } else {
      // Show error to user
    }
  }

  const stakeSSGT = () => {
    depositSSGT(utils.parseUnits(walletAmount, 18))
  }

  useEffect(() => {
    // handle state
    if (
      approveAllowanceFunctionState &&
      approveAllowanceFunctionState.status === 'Success'
    ) {
      stakeSSGT()
    } else if (
      approveAllowanceFunctionState &&
      approveAllowanceFunctionState.status === 'Exception'
    ) {
      setWalletAmount('')
      dispatch(stakingFailed())
      dispatch(
        errorModalAction(true, approveAllowanceFunctionState.errorMessage),
      )
    }
  }, [approveAllowanceFunctionState])

  useEffect(() => {
    // handle state
    if (
      depositSSGTFunctionState &&
      depositSSGTFunctionState.status === 'Success'
    ) {
      setWalletAmount('')
      dispatch(stakingSucess())
    } else if (
      depositSSGTFunctionState &&
      depositSSGTFunctionState.status === 'Exception'
    ) {
      setWalletAmount('')
      dispatch(stakingFailed())
      dispatch(errorModalAction(true, depositSSGTFunctionState.errorMessage))
    }
  }, [depositSSGTFunctionState])

  const checkAndclaimSSGT = () => {
    dispatch(nftClaimInProgress())
    dispatch(nftModalAction(false, selector))
    !isApprovedForNftClaim
      ? setApproveForNft(process.env.REACT_APP_SSGT_CONTRACT_ADDRESS, true)
      : claimSSGT()
  }

  const checkAndHarvest = () => {
    dispatch(harvestingInProgress())
    harvest()
  }

  useEffect(() => {
    // handle state
    if (harvestFunctionState && harvestFunctionState.status === 'Success') {
      dispatch(harvestingSuccess())
    } else if (
      harvestFunctionState &&
      harvestFunctionState.status === 'Exception'
    ) {
      setWalletAmount('')
      dispatch(harvestingFailed())
      dispatch(errorModalAction(true, harvestFunctionState.errorMessage))
    }
  }, [harvestFunctionState])

  const claimSSGT = () => {
    selectedTokenList.forEach((token) => {
      withdrawWithNFT(token)
    })
  }

  useEffect(() => {
    // handle state
    if (
      setApproveForNftFunctionState &&
      setApproveForNftFunctionState.status === 'Success'
    ) {
      claimSSGT()
    } else if (
      setApproveForNftFunctionState &&
      setApproveForNftFunctionState.status === 'Exception'
    ) {
      setSelectedTokenList([])
      dispatch(nftClaimFailed())
      dispatch(
        errorModalAction(true, setApproveForNftFunctionState.errorMessage),
      )
    }
  }, [setApproveForNftFunctionState])

  useEffect(() => {
    if (
      withdrawWithNFTFunctionState &&
      withdrawWithNFTFunctionState.status === 'Success'
    ) {
      setSelectedTokenList([])
      dispatch(nftClaimSucess())
    } else if (
      withdrawWithNFTFunctionState &&
      withdrawWithNFTFunctionState.status === 'Exception'
    ) {
      setSelectedTokenList([])
      dispatch(nftClaimFailed())
      dispatch(
        errorModalAction(true, withdrawWithNFTFunctionState.errorMessage),
      )
    }
  }, [withdrawWithNFTFunctionState])

  return (
    <StakeCards
      title="SSGT"
      percent={rewardRate}
      totalstaked={parseFloat(totalStaked)}
      totalstakers={totalStakers}
      ssgtStaked={parseFloat(ssgtStaked)}
      totalNftTokens={parseFloat(totalNFTTokensOfUser)}
      ssgtEarned={parseFloat(ssgtEarned)}
      logo={StakeLogo2}
      isNFTEnabled={true}
      ownedNFT={ownedNFT}
      isApprovedForNft={isApprovedForNftClaim}
      allowance={allowance}
      walletBalance={walletBalance}
      walletAmount={walletAmount}
      selectedTokenList={selectedTokenList}
      updateTokenIdList={updateTokenIdList}
      updateWalletAmount={updateWalletAmount}
      checkAndStakeSSGT={checkAndStakeSSGT}
      checkAndUnStakeSSGT={checkAndUnStakeSSGT}
      checkAndclaimSSGT={checkAndclaimSSGT}
      checkAndHarvest={checkAndHarvest}
      usdRate={usdRate}
      tokenList={tokenList}
    />
  )
}

export default Ssgt
