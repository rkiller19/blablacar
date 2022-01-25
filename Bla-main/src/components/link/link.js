import React from 'react'
import classnames from 'classnames'

import { link } from './link.module.scss'

export function Link({ className, children, ...props }) {
  const classNames = classnames(className, link)

  return (
    <a className={classNames} {...props}>
      {children}
    </a>
  )
}
