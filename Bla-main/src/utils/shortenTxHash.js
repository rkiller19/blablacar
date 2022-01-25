export function shortenTxHash(hash) {
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
}
