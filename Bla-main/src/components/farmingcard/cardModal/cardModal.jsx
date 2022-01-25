import React, { useState, useEffect } from 'react'

import {
  cardModal,
  cardModalTitle,
  cardModalInputContainer,
  cardModalInput,
  cardModalMaxButton,
  cardModalBalance,
} from './cardModal.module.scss'
import { Modal, Title, Button, Input } from '../../'

export function CardModal(props) {
  const { title, isOpen, closeHandler, balance, callMethod, buttonText } = props
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    props.updateWalletAmount(inputValue)
  }, [inputValue])

  const inputHandler = (e) => {
    setInputValue(e.target.value)
  }

  const callMethodHandler = () => {
    if (props.walletAmount === 0 || props.walletAmount === '') {
      return
    }
    callMethod()
  }

  return (
    <Modal isOpen={isOpen} closeHandler={closeHandler}>
      <div className={cardModal}>
        <Title className={cardModalTitle} level={3}>
          {title}
        </Title>
        <div className={cardModalInputContainer}>
          <Input
            onChange={inputHandler}
            value={inputValue}
            className={cardModalInput}
          />
          <Button
            className={cardModalMaxButton}
            onClick={() => {
              setInputValue(String(balance))
            }}
          >
            Max
          </Button>
        </div>

        <span className={cardModalBalance}>Balance: {balance}</span>

        <Button
          onClick={callMethodHandler}
          disabled={props.walletAmount === 0 || props.walletAmount === ''}
        >
          {buttonText}
        </Button>
      </div>
    </Modal>
  )
}
