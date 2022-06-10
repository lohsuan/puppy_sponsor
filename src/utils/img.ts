/**
 * A tools that help you upload simple images to imgur.com.
 * see https://github.com/Xanonymous-GitHub/imgur-services for more details.
 * */

import axios from "axios";

const imgServicesApiUrl = 'https://imgur-up.herokuapp.com'

export interface ResponseError {
  readonly statusCode?: number,
  readonly message?: string
}

export interface UploadedMedia {
  url: string
}

// eslint-disable-next-line
const errorResolver = (e: any): ResponseError => {
  if (e && e.response && e.response.data) {
    return e.response.data
  } else {
    return {
      statusCode: e.status || 502,
      message: 'Unknown Error!'
    }
  }
}

export const isImageFile = (file: File): boolean => {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  return file && acceptedImageTypes.includes(file['type'])
}

export const uploadMedia = async (file: File, preferredType?: string): Promise<UploadedMedia | ResponseError> => {
  const formData = new FormData();
  formData.append("file", file)
  preferredType && formData.append("type", preferredType)
  try {
    const {data} = await axios.post(imgServicesApiUrl + '/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}
