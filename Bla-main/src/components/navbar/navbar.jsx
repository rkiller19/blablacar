import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEthers, shortenAddress } from '@usedapp/core'

import WalletLogo from '../../assets/Vector.png'
import { inandout } from '../../actions/sidebarAction'
import { connectionAction } from '../../actions/connectionAction'
import { withWalletConnection } from '../../utils/withWalletConnection'

const NavbarPure = ({ activateWallet, deactivateWallet }) => {
  const { account, error } = useEthers()

  const dispatch = useDispatch()
  const history = useHistory()
  const isConnected = useSelector((state) => state.connectionReducer)

  let navbarName = window.location.pathname.split('/').join('')
  if (navbarName === '' || navbarName.toLowerCase() === 'farming') {
    navbarName = 'Farming'
  }
  if (navbarName === 'staking') {
    navbarName = 'Staking'
  }
  const SideBar = () => {
    dispatch(inandout(true))
  }

  useEffect(() => {
    if (error) {
      // show error to user if user denied connection request
      dispatch(connectionAction(false))
    }
  }, [error])

  useEffect(() => {
    if (!isConnected && navbarName === 'Farming') {
      history.push('/')
    }
  }, [isConnected, account])

  useEffect(() => {
    if (!account) {
      // show error to user if user denied connection request
      dispatch(connectionAction(false))
    }
  }, [account])

  return (
    <div className="navbar-main">
      <div className="navbar-name">
        <div className="burger" onClick={SideBar}>
          <div className="burger-icon" />
          <div className="burger-icon" />
          <div className="burger-icon" />
        </div>
        <p>{navbarName}</p>
      </div>
      <div className="connection">
        {isConnected && (
          <div className="details">
            <img src={WalletLogo} alt=""  height="50px" width="50px" />
            <p>{account && shortenAddress(account)}</p>
          </div>
        )}
        {!isConnected && (
          <button className="button" onClick={activateWallet}>
            Connect Wallet
          </button>
        )}
        {isConnected && (
          <button className="button" onClick={deactivateWallet}>
            Disconnect Wallet
          </button>
        )}
      </div>
    </div>
  )
}

export const Navbar = withWalletConnection(NavbarPure)
