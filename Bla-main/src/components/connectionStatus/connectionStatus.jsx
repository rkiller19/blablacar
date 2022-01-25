import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useEthers, shortenAddress } from '@usedapp/core'
import { UnsupportedChainIdError } from '@web3-react/core'
import classnames from 'classnames'

import WalletIcon from '../../assets/wallet-red.png'
import ArrowDown from '../../assets/arrow-down.png'
import { Button } from '../'
import {
  connectionStatus,
  walletIcon,
  accountAddressBlock,
  accountAddress,
  connectButton,
  disconnectButton,
  networksMenu,
  networksMenuHidden,
  networksMenuList,
  networksMenuWrapper,
  networksMenuButton,
  networksMenuArrow,
} from './connectionStatus.module.scss'
import { withWalletConnection } from '../../utils/withWalletConnection'
import { switchNetwork } from '../../utils/switchNetwork'
import NETWORKS from '../../networks.json'
import { supportedChains } from '../../constants'

function NetworkSwitcher({ deactivateWallet }) {
  const { chainId, error } = useEthers()
  const [menuIsVisible, setMenuIsVidible] = useState(false)
  const wrongNetwork = error instanceof UnsupportedChainIdError

  const menuClassNames = classnames(networksMenu, {
    [networksMenuHidden]: !menuIsVisible,
  })

  const selectButtonText = wrongNetwork
    ? 'Wrong Network'
    : NETWORKS[chainId].name

  return (
    <div className={networksMenuWrapper}>
      <Button
        onClick={() => {
          setMenuIsVidible(!menuIsVisible)
        }}
      >
        {selectButtonText}
        <img className={networksMenuArrow} src={ArrowDown} alt="Select" />
      </Button>
      <div className={menuClassNames}>
        Select network
        <div className={networksMenuList}>
          {supportedChains.map((id) => {
            if (chainId === id) {
              return null
            }

            return (
              <Button
                key={id}
                onClick={() => {
                  switchNetwork(id)
                }}
                className={networksMenuButton}
              >
                {NETWORKS[id].name}
              </Button>
            )
          })}
          <Button onClick={deactivateWallet} className={disconnectButton}>
            Disconnect
          </Button>
        </div>
      </div>
    </div>
  )
}

function ConnectionStatusPure({ activateWallet, deactivateWallet }) {
  const { account, error } = useEthers()
  const isConnected = useSelector((state) => state.connectionReducer)
  const wrongNetwork = error instanceof UnsupportedChainIdError

  const ConnectionResult = () => {
    if (error && !wrongNetwork) {
      return (
        <Button disabled className={connectButton}>
          Error
        </Button>
      )
    }

    if (wrongNetwork) {
      return <NetworkSwitcher deactivateWallet={deactivateWallet} />
    }

    if (isConnected && account) {
      return (
        <>
          <div className={accountAddressBlock}>
            <img className={walletIcon} src={WalletIcon} alt="Wallet" />
            <span className={accountAddress}>
              {account && shortenAddress(account)}
            </span>
          </div>
          <NetworkSwitcher deactivateWallet={deactivateWallet} />
        </>
      )
    }

    return (
      <Button onClick={activateWallet} className={connectButton}>
        Connect Wallet
      </Button>
    )
  }

  return (
    <div className={connectionStatus}>
      <ConnectionResult />
    </div>
  )
}

export const ConnectionStatus = withWalletConnection(ConnectionStatusPure)
