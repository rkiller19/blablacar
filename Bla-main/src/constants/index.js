import NETWORKS from '../networks.json'

export const supportedChains = Object.keys(NETWORKS).map((id) => Number(id))
