import React from 'react'

import { spinner, spinnerInner } from './spinner.module.scss'

export function Spinner() {
  return (
    <div className={spinner}>
      <div className={spinnerInner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}
