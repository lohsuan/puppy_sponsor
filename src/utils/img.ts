import { ipfsSourceUrlPrefix } from './ipfs'

export const isImageFile = (file: File): boolean => {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png']
  return file && acceptedImageTypes.includes(file['type'])
}

const imgUrlRegex = /^https:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/

export const isImageUrlStr = (urlStr: string): boolean => {
  const expectUrlStr = urlStr.trim()

  if (expectUrlStr === '' || !expectUrlStr.match(imgUrlRegex)) {
    if (!expectUrlStr.startsWith(ipfsSourceUrlPrefix)) {
      return false
    }
  }

  try {
    new URL(expectUrlStr)
    return true
  } catch (e) {
    return false
  }
}
