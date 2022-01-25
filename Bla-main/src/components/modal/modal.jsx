import React from 'react'
import ReactModal from 'react-modal'

import { overlay, content, closeModalButton } from './modal.module.scss'
import { CloseButton } from '../'

export const Modal = ({ children, isOpen, closeHandler }) => {
  ReactModal.setAppElement('#root')

  return (
    <ReactModal
      isOpen={isOpen}
      className={content}
      overlayClassName={overlay}
      onRequestClose={closeHandler}
      contentElement={(props, children) => <div {...props}>{children}</div>}
    >
      <CloseButton className={closeModalButton} onClick={closeHandler} />

      {children}
    </ReactModal>
  )
}
