import React, { useContext, useLayoutEffect, useRef, useState } from 'react'
import { isImageFile, isImageUrlStr, uploadMedia } from '../utils/img'
import { isValidDateStr } from '../utils/date'
import { useDebounce, useToggle } from 'react-use'
import { transactionContext } from '../context/TransactionContext'
import Swal from 'sweetalert'

/**
 * Content management pages for third-party agencies.
 * This page can interact with all contract methods that require an owner EOA.
 *
 * @returns {JSXElement} The AdminPage Component.
 * */
const AddPuppyPage = () => {
  const defaultNewPuppyImgPlaceHolderUrl = '/default-placeholder.webp'

  const { createNewPuppy, owner, currentAccount } = useContext(transactionContext)

  owner().then((_owner) => {
    if (currentAccount !== _owner) {
      Swal({
        icon: 'error',
        title: 'You are not able to add any puppy',
        text: 'Please login as the foundation owner and try again' + _owner
      }).then()
    }
  })

  const [newPuppyName, setNewPuppyName] = useState('')
  const [newPuppyBirthday, setNewPuppyBirthday] = useState('')
  const [newPuppyDesc, setNewPuppyDesc] = useState('')
  const [newPuppyImgUrl, setNewPuppyImgUrl] = useState(defaultNewPuppyImgPlaceHolderUrl)
  const [isProcessing, setIsProcessing] = useToggle(false)
  const [isFormValid, setIsFormValid] = useToggle(false)

  const fileUploader = useRef(null)

  useDebounce(
    () =>
      setIsFormValid(
        newPuppyName.trim() !== '' &&
          newPuppyImgUrl !== defaultNewPuppyImgPlaceHolderUrl &&
          isImageUrlStr(newPuppyImgUrl) &&
          isValidDateStr(newPuppyBirthday)
      ),
    300,
    [newPuppyName, newPuppyImgUrl, newPuppyBirthday]
  )

  const uploadButtonClicked = () => {
    if (isProcessing) {
      return
    }

    fileUploader.current.click()
  }

  /**
   * @param {InputEvent} e
   * */
  const onDesireUploadFileChosen = async (e) => {
    if (isProcessing) {
      return
    }

    const file = e.target.files[0]
    if (!isImageFile(file)) {
      return
    }

    setIsProcessing(true)
    const { url } = await uploadMedia(file, 'webp')
    setIsProcessing(false)

    if (url) {
      setNewPuppyImgUrl(url)
    } else {
      await Swal({
        icon: 'error',
        title: 'Oops...',
        text: 'Can not upload image, QAQ'
      })
    }
  }

  const onCreatePuppyClicked = async () => {
    if (isProcessing) {
      return
    }

    if (!isFormValid) {
      await Swal({
        icon: 'info',
        title: 'Some info seems not correct!',
        text: 'Please check your inputs and try again'
      })
      return
    }

    setIsProcessing(true)
    const ok = await createNewPuppy({
      name: newPuppyName,
      birthday: newPuppyBirthday,
      imageUrl: newPuppyImgUrl,
      description: newPuppyDesc
    })

    if (!ok) {
      await Swal({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      })
    } else {
      await Swal({
        icon: 'success',
        title: 'Nice!',
        text: 'Puppy has been created.'
      })
    }

    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen">
      <div className="m-auto p-5 max-w-[90vw] xl:max-w-[70vw] md:w-auto rounded-lg border shadow-md border-gray-700 bg-gray-100 dark:bg-gray-800">
        <p className="text-center dark:text-white font-extrabold text-2xl my-5 md:my-2 text-gray-900">New Puppy</p>
        <div className="flex flex-col items-center md:flex-row">
          <div className="flex flex-col h-auto w-1/3 my-2">
            <img
              className="md:w-full cursor-pointer p-5 border-dashed border-4 border-gray-400 hover:border-amber-300 object-cover w-auto rounded-t-lg  md:rounded-none md:rounded-l-lg"
              src={
                (isImageUrlStr(newPuppyImgUrl) && newPuppyImgUrl) ||
                defaultNewPuppyImgPlaceHolderUrl
              }
              onClick={uploadButtonClicked}
              alt="newPuppyImg"
            />
            <input
              onInput={onDesireUploadFileChosen}
              ref={fileUploader}
              className="hidden"
              type="file"
              accept="image/jpeg,image/png,image/gif"
            />

            <label
              htmlFor="custom-image-input"
              className="block my-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Or Image Url
            </label>
            <input
              type="text"
              id="custom-image-input"
              placeholder="https://"
              onChange={(el) => setNewPuppyImgUrl(el.target.value)}
              className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div className="w-full flex flex-col justify-between p-4 leading-normal">
            <div className="mb-6">
              <label
                htmlFor="new-puppy-name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Puppy Name
              </label>
              <input
                type="text"
                id="new-puppy-name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="My lovely dog :)"
                onChange={(el) => {
                  setNewPuppyName(el.target.value)
                }}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="new-puppy-date-picker"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Birthday
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  id="new-puppy-date-picker"
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Please enter with format yyyy/mm/dd"
                  onChange={(el) => {
                    setNewPuppyBirthday(el.target.value)
                  }}
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="new-puppy-description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Description
              </label>
              <textarea
                id="new-puppy-description"
                rows="4"
                className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="About this puppy..."
                onChange={(el) => setNewPuppyDesc(el.target.value)}
              />
            </div>

            <div className="flex items-start mb-6">
              <button
                type="button"
                disabled={isProcessing || !isFormValid}
                onClick={onCreatePuppyClicked}
                className="text-white disabled:bg-gray-400 disabled:opacity-20 bg-[#FF9119] enabled:hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center enabled:dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2"
              >
                <svg
                  className="w-4 h-4 mr-2 -ml-1 text-[#626890]"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="ethereum"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path
                    fill="white"
                    d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"
                  ></path>
                </svg>
                Create new Puppy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddPuppyPage
