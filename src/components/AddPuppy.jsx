import { useContext, useEffect, useRef, useState } from 'react'
import { isImageFile, isImageUrlStr } from '../utils/img'
import { isValidDateStr } from '../utils/date'
import { useDebounce, useToggle } from 'react-use'
import { transactionContext } from '../context/TransactionContext'
import Swal from 'sweetalert'
import { uploadFile } from '../utils/ipfs'

/**
 * Content management pages for third-party agencies.
 * This page can interact with all contract methods that require an owner EOA.
 *
 * @returns {JSXElement} The AdminPage Component.
 * */
const AddPuppyPage = () => {
  const defaultNewPuppyImgPlaceHolderUrl = '/default-placeholder.webp'

  const { createNewPuppy, owner, currentAccount } = useContext(transactionContext)
  const [newPuppyName, setNewPuppyName] = useState('')
  const [newPuppyBirthday, setNewPuppyBirthday] = useState('')
  const [newPuppyDesc, setNewPuppyDesc] = useState('')
  const [newPuppyImgUrl, setNewPuppyImgUrl] = useState(defaultNewPuppyImgPlaceHolderUrl)
  const [isProcessing, setIsProcessing] = useToggle(false)
  const [isFormValid, setIsFormValid] = useToggle(false)
  const [isOwner, setIsOwner] = useState(false)
  const [isLoadingImg, setIsLoadingImg] = useState(false)

  const fileUploader = useRef(null)

  const warnIfNotOwner = () => {
    owner().then((_owner) => {
      if (currentAccount !== _owner) {
        Swal({
          icon: 'error',
          title: 'You are not able to add puppy',
          text: 'Transaction will fail since you are not owner.\nPlease login as the foundation owner and try again.'
        }).then()
      } else {
        setIsOwner(true)
      }
    })
  }

  useEffect(() => {
    warnIfNotOwner()
  }, [isOwner])

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
    setIsLoadingImg(true)
    const { url } = await uploadFile(file)
    setIsProcessing(false)
    setIsLoadingImg(false)

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
        <p className="text-center dark:text-white font-extrabold text-2xl my-5 md:my-2 text-gray-900">
          New Puppy
        </p>
        <div className="flex flex-col items-center md:flex-row">
          <div className="flex flex-col h-auto w-1/3 my-2">
            <div className="md:w-full cursor-pointer p-5 border-dashed border-4 border-gray-400 hover:border-amber-300 object-cover w-auto rounded-t-lg  md:rounded-none md:rounded-l-lg">
              {isLoadingImg ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                >
                  <path
                    fill="currentColor"
                    d="M100 50.5908c0 27.6143-22.3858 50.0002-50 50.0002S0 78.2051 0 50.5908C0 22.9766 22.3858.59082 50 .59082s50 22.38578 50 49.99998Zm-90.91856 0C9.08144 73.1895 27.4013 91.5094 50 91.5094s40.9186-18.3199 40.9186-40.9186C90.9186 27.9921 72.5987 9.67226 50 9.67226c-22.5987 0-40.91856 18.31984-40.91856 40.91854Z"
                  />
                  <path
                    fill="currentFill"
                    d="M93.9676 39.0409c2.4254-.6371 3.8948-3.1293 3.0403-5.487-1.7147-4.7312-4.1369-9.1847-7.1912-13.2059-3.9715-5.2288-8.9341-9.6242-14.6043-12.93511-5.6702-3.31095-11.937-5.47264-18.4426-6.36165-5.0032-.683699-10.0722-.604397-15.0353.22749-2.4732.41455-3.9215 2.91905-3.2844 5.34453.6372 2.42548 3.1193 3.84844 5.6004 3.48384 3.8006-.55855 7.6686-.58021 11.4897-.058 5.324.7275 10.4526 2.4966 15.0929 5.2061 4.6404 2.7096 8.7016 6.3067 11.9518 10.5858 2.3326 3.0711 4.2148 6.4503 5.5962 10.0348.9019 2.34 3.361 3.8023 5.7865 3.1651Z"
                  />
                </svg>
              ) : (
                <img
                  src={
                    (isImageUrlStr(newPuppyImgUrl) && newPuppyImgUrl) ||
                    defaultNewPuppyImgPlaceHolderUrl
                  }
                  onClick={uploadButtonClicked}
                  alt="newPuppyImg"
                />
              )}
            </div>
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
