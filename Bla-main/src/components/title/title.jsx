import React from 'react'
import classnames from 'classnames'

import { h1, h2, h3, h4, h5, h6 } from './title.module.scss'

export function Title({ level, children, className, ...props }) {
  let TitleTag
  let levelClassName

  switch (level) {
    case 1:
      TitleTag = 'h1'
      levelClassName = h1
      break
    case 2:
      TitleTag = 'h2'
      levelClassName = h2
      break
    case 3:
      TitleTag = 'h3'
      levelClassName = h3
      break
    case 4:
      TitleTag = 'h4'
      levelClassName = h4
      break
    case 5:
      TitleTag = 'h5'
      levelClassName = h5
      break
    case 6:
      TitleTag = 'h6'
      levelClassName = h6
      break
    default:
      TitleTag = 'span'
  }

  const classNames = classnames(levelClassName, className)

  return (
    <TitleTag className={classNames} {...props}>
      {children}
    </TitleTag>
  )
}
