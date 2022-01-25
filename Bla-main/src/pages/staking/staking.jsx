import React from 'react'
import { useEthers } from '@usedapp/core'

import NetworksConfig from '../../networks.json'

import { MainLayout, StakingCard, CardsContainer } from '../../components'

export const Staking = () => {
  const { chainId } = useEthers()

  const Content = () => {
    if (chainId) {
      const tokenContract = NetworksConfig[chainId].tokenContract
      const fixedStakingContracts =
        NetworksConfig[chainId].fixedStakingContracts

      return (
        <CardsContainer>
          {fixedStakingContracts.map(({ address, APY }) => (
            <StakingCard
              key={address}
              APY={APY}
              contractAddress={address}
              tokenContract={tokenContract}
            />
          ))}
        </CardsContainer>
      )
    }
  }

  return (
    <MainLayout title="Staking">
      <Content />
    </MainLayout>
  )
}
