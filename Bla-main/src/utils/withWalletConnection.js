import React from 'react'
import { useEthers } from '@usedapp/core'
import { useDispatch } from 'react-redux'

import MakeQuerablePromise from './querable-promise'
import { connectionAction } from '../actions/connectionAction'

export function withWalletConnection(Component) {
  return function(props) {
    const { activateBrowserWallet, deactivate } = useEthers()
    const dispatch = useDispatch()

    const activateWallet = async () => {
      const activateBrowserWalletPromise = MakeQuerablePromise(
        activateBrowserWallet(),
      )
      activateBrowserWalletPromise.then(
        function() {
          if (activateBrowserWalletPromise.isFulfilled()) {
            dispatch(connectionAction(true))
          }
        },
        function() {
          /* code if some error */

          dispatch(connectionAction(false))
        },
      )
    }

    const deactivateWallet = () => {
      deactivate()
      dispatch(connectionAction(false))
    }

    return (
      <Component
        activateWallet={activateWallet}
        deactivateWallet={deactivateWallet}
        {...props}
      />
    )
  }
}
