import React, { useContext, useState } from 'react'
import { useToggle } from 'react-use'
import { transactionContext } from '../context/TransactionContext'

const PuppyTokenPage = () => {
  const { tokenSymbol, tokenAmounts, transferPuppyToken } = useContext(transactionContext)
  const [isProcessing, setIsProcessing] = useToggle(false)
  const [addressTo, setAddressTo] = useState('')
  const [amount, setAmount] = useState(-1)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsProcessing(true)
    await transferPuppyToken(addressTo, amount)
    setIsProcessing(false)
  }

  const handleAddressToInputChange = (e) => {
    setAddressTo(e.target.value)
  }

  const handleAmountInputChange = (e) => {
    setAmount(Number.parseInt(e.target.value))
  }

  return (
    <div className="min-h-screen">
      <div className="m-auto p-5 max-w-[90vw] xl:max-w-[70vw] md:w-auto rounded-lg border shadow-md border-gray-700 bg-gray-100 bg-gray-800">
        <div className="flex items-center space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
          >
            <path d="m12 14 9-5-9-5-9 5 9 5z" />
            <path d="m12 14 6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m12 14 9-5-9-5-9 5 9 5zm0 0 6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14zm-4 6v-7.5l4-2.222"
            />
          </svg>
          <div className="space-y-1 font-medium text-white">
            <div>{tokenSymbol}</div>
            <div className="text-sm text-gray-500 text-gray-400">{tokenAmounts}</div>
          </div>
        </div>
      </div>
      <div className="m-auto p-5 max-w-[90vw] xl:max-w-[70vw] md:w-auto rounded-lg border shadow-md border-gray-700 bg-gray-100 bg-gray-800">
        <div className="space-y-1 font-medium text-white">Transfer</div>
        <input
          placeholder="To"
          type="string"
          value={addressTo}
          onChange={handleAddressToInputChange}
          required
          className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        />
        <input
          placeholder="Amount (>= 1 PUPPY)"
          type="number"
          step="1"
          value={amount < 0 ? '' : amount}
          onChange={handleAmountInputChange}
          required
          className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        />
        {isProcessing ?
          <button type="button" disabled className="flex items-center justify-center text-white w-full mt-2 border-[1px] p-2 border-[#8e9fc9d5] rounded-full cursor-not-allowed">
            <svg class="animate-spin w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </button>
          :
          <button
            type="button"
            onClick={handleSubmit}
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
          >
            Send now
          </button>
        }
      </div>
    </div>
  )
}

export default PuppyTokenPage
