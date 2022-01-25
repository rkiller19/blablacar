import { ethers } from 'ethers'

export function formatAttoToToken(amount) {
  const number = ethers.utils.formatUnits(amount, 18).toString()
  const decimals = 4
  let counter = 0
  let result = ''

  for (let i = 0; i < number.length; i++) {
    if (number[i] === '.' || counter > 0) {
      counter++
    }

    if (counter === decimals + 1) {
      result += number[i]
      return Number(result)
    }

    result += number[i]
  }

  return Number(result)
}

export function formatTokenToAtto(amount) {
  return ethers.utils.parseUnits(amount, 18)
}
