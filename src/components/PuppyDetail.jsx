import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { transactionContext } from '../context/TransactionContext'
import { Loader } from '.'
import { shortenAddress } from '../utils/shortenAddress'

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
 * @returns {JSXElement} PuppyCard, with a donate button.
 * */
const PuppyDetail = () => {
  const { handleChange, puppies, donateForPuppy, formData, isLoading, transactions } =
    useContext(transactionContext)
  const params = useParams()
  const puppy = puppies.find((puppy) => puppy.puppyId == params.id)

  const handleSubmit = (e) => {
    const { amount, keyword, message } = formData
    e.preventDefault()

    if (!amount || !keyword || !message) return

    donateForPuppy(puppy.puppyId)
  }

  return (
    <div className="flex w-full flex-col items-center  justify-center px-5 md:max-w-[70vw] m-auto">
      {puppy && (
        <h1 className="my-5 text-center text-white text-2xl font-extrabold">{puppy.name}</h1>
      )}
      <div className="flex w-full justify-center items-center">
        <div className="flex mf:flex-row flex-col items-center justify-between md:p-8 py-12 px-4">
          <div className="flex flex-1 justify-center items-center flex-col ">
            {puppy && (
              <img
                className="my-2 p-5 md:max-h-max md:h-auto object-cover w-auto rounded-t-lg md:rounded-none md:rounded-l-lg"
                src={puppy.imageUrl}
                alt="puppyImg"
              />
            )}
          </div>

          <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
            {/* input holder */}
            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center">
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
      <table className="border-collapse border border-slate-400 text-white w-full my-5">
        <thead>
          <tr>
            {['Donator', 'Receiver', 'Amount', 'Message', 'Transaction Time'].map((v, i) => (
              <th key={i} className="border border-slate-300 py-2">
                {v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions &&
            transactions
              .filter((x) => x.puppyId == params.id)
              .reverse()
              .map((transaction, i) => (
                <tr key={i}>
                  <td className="border border-slate-300 text-center py-1" >
                    <a
                      href={`https://ropsten.etherscan.io/address/${transaction.addressFrom}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <p className="text-white text-base hover:text-blue-400">{shortenAddress(transaction.addressFrom)}</p>
                    </a>
                  </td>
                  <td className="border border-slate-300 text-center py-1">
                    <a
                      href={`https://ropsten.etherscan.io/address/${transaction.addressTo}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <p className="text-white text-base hover:text-blue-400">{shortenAddress(transaction.addressTo)}</p>
                    </a>
                  </td>
                  <td className="border border-slate-300 text-center py-1">{transaction.amount} ETH</td>
                  <td className="border border-slate-300 text-center py-1">{transaction.message}</td>
                  <td className="border border-slate-300 text-center py-1">{transaction.time}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}

export default PuppyDetail
