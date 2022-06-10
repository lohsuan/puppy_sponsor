import React, { useContext } from 'react'

import { TransactionContext } from '../context/TransactionContext'
import { Loader } from '.'

const companyCommonStyles =
  'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white'

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
)

/**
 * A page to show puppy information and donate.
 *
 * @param {Object} props
 * @param {string} props.name - The puppy's name.
 * @param {string} props.birthday - The puppy's birthday.
 * @param {string} props.imageUrl - The puppy's clear avatar URL.
 * @param {string} props.description - Detail description of the puppy.
 *
 * @returns {JSXElement} PuppyCard, with a donate button.
 * */
const PuppyDetail = ({ imageUrl, name, birthday, description }) => {
  const { currentAccount, connectWallet, handleChange, donateForFood, formData, isLoading } =
    useContext(TransactionContext)

  const handleSubmit = (e) => {
    const { amount, keyword, message } = formData
    console.log(currentAccount)
    e.preventDefault()

    if (!amount || !keyword || !message) return

    donateForFood()
  }

  return (
    <div className="flex w-full flex-col items-center  justify-center px-5 md:max-w-[70vw] m-auto">
      <h1 className="my-5 text-center text-white text-2xl font-extrabold">{name}</h1>

      <div className="flex w-full justify-center items-center">
        {/* mf: media query append to tailwind by us in tailwind.config.js */}
        <div className="flex mf:flex-row flex-col items-center justify-between md:p-8 py-12 px-4">
          <div className="flex flex-1 justify-center items-center flex-col ">
            <img
              className="my-2 p-5 md:max-h-max md:h-auto object-cover w-auto rounded-t-lg md:rounded-none md:rounded-l-lg"
              src="https://i.imgur.com/Abs2mcS.png"
              alt="newPuppyImg"
            />
          </div>

          <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
            {/* input holder */}
            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
              <Input
                placeholder="Amount (ETH)"
                name="amount"
                type="number"
                handleChange={handleChange}
              />
              <Input
                placeholder="Keyword (Gif)"
                name="keyword"
                type="text"
                handleChange={handleChange}
              />
              <Input
                placeholder="Enter Message"
                name="message"
                type="text"
                handleChange={handleChange}
              />

              <div className="h-[1px] w-full bg-gray-400 my-2" />

              {isLoading ? (
                <Loader />
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Send now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* list of transaction */}
      <table className="border-collapse border border-slate-400 text-white w-full">
        <thead>
          <tr>
            {['From', 'To', 'Amount', 'Message', 'Transaction Time'].map((v) => (
              <th className="border border-slate-300">{v}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {['From', 'To', 'Amount', 'Message', 'Transaction Time'].map((v) => (
              <th className="border border-slate-300">{v}</th>
            ))}
            <td className="border border-slate-300">Indiana</td>
            <td className="border border-slate-300">Indianapolis</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PuppyDetail
