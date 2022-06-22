import React, { useContext, useState } from 'react'
import { useToggle } from 'react-use'
import { transactionContext } from '../context/TransactionContext'

const ProcessingButton = () => (
  <button
    type="button"
    disabled
    className="flex items-center justify-center bg-[#3d4f7c] text-white w-full mt-2 border-[1px] p-2 border-[#8e9fc9d5] rounded-full cursor-not-allowed"
  >
    <svg
      className="animate-spin w-5 mr-2 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    Processing...
  </button>
)

const PuppyTokenPage = () => {
  const {
    tokenSymbol,
    tokenAmounts,
    transferPuppyToken,
    mintPuppyToken,
    burnPuppyToken,
    transferOwner
  } = useContext(transactionContext)
  const [isTransferProcessing, setIsTransferProcessing] = useToggle(false)
  const [isMintProcessing, setIsMintProcessing] = useToggle(false)
  const [isBurnProcessing, setIsBurnProcessing] = useToggle(false)
  const [isTransferOwnerProcessing, setIsTransferOwnerProcessing] = useToggle(false)
  const [addressTo, setAddressTo] = useState('')
  const [transferAmount, setTransferAmount] = useState(0)
  const [mintAmount, setMintAmount] = useState(0)
  const [burnAddress, setBurnAddress] = useState('')
  const [burnAmount, setBurnAmount] = useState(0)
  const [newOwner, setNewOwner] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsTransferProcessing(true)
    await transferPuppyToken(addressTo, transferAmount)
    setAddressTo('')
    setTransferAmount(0)
    setIsTransferProcessing(false)
  }

  const handleMintToken = async (e) => {
    e.preventDefault()

    setIsMintProcessing(true)
    await mintPuppyToken(mintAmount)
    setMintAmount(0)
    setIsMintProcessing(false)
  }

  const handleBurnToken = async (e) => {
    e.preventDefault()

    setIsBurnProcessing(true)
    await burnPuppyToken(burnAddress, burnAmount)
    setBurnAddress('')
    setBurnAmount(0)
    setIsBurnProcessing(false)
  }

  const handleTransferOwner = async (e) => {
    e.preventDefault()

    setIsTransferOwnerProcessing(true)
    await transferOwner(newOwner)
    setNewOwner('')
    setIsTransferOwnerProcessing(false)
  }

  return (
    <div className="min-h-screen">
      {/* My Tokens */}
      <p className="text-xl text-white m-auto p-3 max-w-[90vw] xl:max-w-[70vw] md:w-auto">
        My Tokens
      </p>
      <div className="m-auto p-5 max-w-[90vw] xl:max-w-[70vw] md:w-auto rounded-lg border shadow-md border-gray-700 bg-gray-800">
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
            <div className="text-sm text-gray-400">{tokenAmounts}</div>
          </div>
        </div>
      </div>
      {/* User's Operation */}
      <p className="text-xl mt-2 text-white m-auto p-3 max-w-[90vw] xl:max-w-[70vw] md:w-auto">
        User's Operation
      </p>
      <div className="m-auto p-5 max-w-[90vw] xl:max-w-[70vw] md:w-auto rounded-lg border shadow-md border-gray-700 bg-gray-800">
        <div className="space-y-1 font-medium text-white">Transfer</div>
        <input
          placeholder="To"
          type="string"
          value={addressTo}
          onChange={(e) => setAddressTo(e.target.value)}
          required
          className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        />
        <input
          placeholder="Amount (>= 1 PUPPY)"
          type="number"
          step="1"
          value={transferAmount < 1 ? '' : transferAmount}
          onChange={(e) => setTransferAmount(Number.parseInt(e.target.value))}
          required
          className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        />
        {isTransferProcessing ? (
          <ProcessingButton />
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

      {/* Owner's Operation */}
      <p className="text-xl mt-2 text-white m-auto p-3 max-w-[90vw] xl:max-w-[70vw] md:w-auto">
        Owner's Operation
      </p>
      <div className="m-auto p-5 max-w-[90vw] xl:max-w-[70vw] md:w-auto rounded-lg border shadow-md border-gray-700 bg-gray-800">
        <div className="space-y-1 font-medium text-white">Mint PUPPY token</div>
        <input
          placeholder="Amount (>= 1 PUPPY)"
          type="number"
          step="1"
          value={mintAmount < 1 ? '' : mintAmount}
          onChange={(e) => setMintAmount(Number.parseInt(e.target.value))}
          required
          className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        />
        {isMintProcessing ? (
          <ProcessingButton />
        ) : (
          <button
            type="button"
            onClick={handleMintToken}
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
          >
            Mint
          </button>
        )}
      </div>
      <div className="m-auto mt-5 p-5 max-w-[90vw] xl:max-w-[70vw] md:w-auto rounded-lg border shadow-md border-gray-700 bg-gray-800">
        <div className="space-y-1 font-medium text-white">Burn PUPPY token</div>
        <input
          placeholder="From"
          type="string"
          value={burnAddress}
          onChange={(e) => setBurnAddress(e.target.value)}
          required
          className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        />
        <input
          placeholder="Amount (>= 1 PUPPY)"
          type="number"
          step="1"
          value={burnAmount < 1 ? '' : burnAmount}
          onChange={(e) => setBurnAmount(Number.parseInt(e.target.value))}
          required
          className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        />
        {isBurnProcessing ? (
          <ProcessingButton />
        ) : (
          <button
            type="button"
            onClick={handleBurnToken}
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
          >
            Burn
          </button>
        )}
      </div>
      <div className="m-auto p-5 mt-5 p-5 max-w-[90vw] xl:max-w-[70vw] md:w-auto rounded-lg border shadow-md border-gray-700 bg-gray-800">
        <div className="space-y-1 font-medium text-white">Change PUPPY owner</div>
        <input
          placeholder="New Owner Address"
          type="string"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
          required
          className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        />
        {isTransferOwnerProcessing ? (
          <ProcessingButton />
        ) : (
          <button
            type="button"
            onClick={handleTransferOwner}
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  )
}

export default PuppyTokenPage
