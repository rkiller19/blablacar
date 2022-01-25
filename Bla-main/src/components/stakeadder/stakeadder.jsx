import React from 'react'
import { useDispatch } from 'react-redux'

import { modalAction } from '../../actions/modalAction'

export const StakeAdder = (props) => {
  const dispatch = useDispatch()
  const close = () => {
    dispatch(modalAction(false, ''))
  }

  return (
    <div className="card-shadow">
      <div className="stake-adder-card">
        <div className="stake-header">
          <p>Deposit {props.tokenName}</p>
          <p onClick={close}>x</p>
        </div>
        <div className="balance">
          {/* <p>Balance in wallet: {utils.commify(utils.parseEther(props.walletBalance))}</p> */}
          <p>Balance in wallet: {props.walletBalance}</p>
        </div>
        <div className="add-on">
          <div className="input-value">
            <input
              type="text"
              placeholder={'Enter amount'}
              value={props.walletAmount}
              onChange={(e) => props.updateWalletAmount(e.target.value)}
            />
          </div>
          <input
            type="submit"
            value="MAX"
            onClick={() => props.updateWalletAmount(props.walletBalance)}
          />
          <div className="stake-type">
            <p>{props.tokenName.replace(/ *\([^)]*\)*/g, '')}</p>
          </div>
        </div>
        <div className="button-stake">
          {props.walletAmount === 0 || props.walletAmount === '' ? (
            <button className="button" disabled>
              Deposit
            </button>
          ) : (
            <button className="button" onClick={props.checkAndStakeSSGT}>
              Deposit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
