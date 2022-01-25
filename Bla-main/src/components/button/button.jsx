import React from 'react'
import classnames from 'classnames'

import { button, buttonDisabled } from './button.module.scss'

export function Button({ children, type, disabled, className, ...props }) {
  const classNames = classnames(className, button, {
    [buttonDisabled]: disabled,
  })

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  )
}
