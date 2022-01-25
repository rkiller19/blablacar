import React from 'react'

import { stakingCardsContainer } from './cardsContainer.module.scss'

export function CardsContainer({ children }) {
  return <div className={stakingCardsContainer}>{children}</div>
}
