import { create as createIPFSClient } from 'ipfs-http-client'
import type { Options } from 'ipfs-http-client'

export interface UploadedMedia {
  url: string
}

const ipfsOptions: Options = {
  host: 'ipfs.infura.io',
  protocol: 'https',
  port: 5001
}

export const ipfsSourceUrlPrefix = 'https://ipfs.infura.io/ipfs/'
const ipfs = createIPFSClient(ipfsOptions)

export const uploadFile = async (file: File): Promise<UploadedMedia | null> => {
  try {
    const { path } = await ipfs.add(file)
    return { url: `${ipfsSourceUrlPrefix}${path}` }
  } catch (e) {
    return null
  }
}
