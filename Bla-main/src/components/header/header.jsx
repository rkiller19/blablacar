import React from 'react'
import { useDispatch } from 'react-redux'

import { openMenuHandler } from '../../actions/menuActions'
import {
  header,
  headerLeftSide,
  headerBurgerButton,
} from './header.module.scss'
import { Title, ConnectionStatus } from '../'

export function Header({ title }) {
  const dispatch = useDispatch()

  const openMenu = () => {
    dispatch(openMenuHandler(true))
  }

  return (
    <header className={header}>
      <div className={headerLeftSide}>
        <button onClick={openMenu} className={headerBurgerButton}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <Title level={1}>{title}</Title>
      </div>
      <ConnectionStatus />
    </header>
  )
}
