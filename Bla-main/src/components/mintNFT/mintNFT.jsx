import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { nftModalAction } from '../../actions/modalAction'

export const MintNFT = (props) => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state.modalReducer.title)
  const close = () => {
    dispatch(nftModalAction(false, selector))
  }

  return (
    <div className="card-shadow">
      <div className="stake-adder-card">
        <div className="stake-header">
          <p>Claim {props.title}</p>
          <p onClick={close}>x</p>
        </div>
        <div className="balance">
          <p>Select TokenId(s):</p>
        </div>
        <div className="add-on">
          <ul className="checkbox">
            {props.tokenList?.map((item) => (
              <li key={item}>
                <input
                  type="checkbox"
                  name="tokenid"
                  key={item}
                  value={item}
                  className="token_check"
                  onChange={(e) => props.updateTokenIdList(e)}
                />
                <span className="token_label"> TokenId [{item}]</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="button-stake">
          {props.selectedTokenList.length === 0 ? (
            <button className="button" disabled>
              Claim
            </button>
          ) : (
            <button className="button" onClick={props.checkAndclaimSSGT}>
              Claim
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
