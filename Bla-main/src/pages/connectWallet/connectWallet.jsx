import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEthers } from '@usedapp/core'

import { MainLayout } from '../../components'
import { connectionAction } from '../../actions/connectionAction'
import { withWalletConnection } from '../../utils/withWalletConnection'

const ConnectWalletPure = ({ activateWallet, deactivateWallet }) => {
  const { account } = useEthers()
  const { error } = useEthers()
  const isConnected = useSelector((state) => state.connectionReducer)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (error) {
      // show error to user if user denied connection request
      dispatch(connectionAction(false))
    }
  }, [error])

  useEffect(() => {
    // if connected redirect user to dashboard
    isConnected && account && history.push('/farming')
  }, [isConnected, account])

  return <MainLayout />
}

export const ConnectWallet = withWalletConnection(ConnectWalletPure)
