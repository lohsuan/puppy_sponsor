import { useContext, useState } from 'react'
import { useToggle } from 'react-use'
import { transactionContext } from '../context/TransactionContext'
import Swal from 'sweetalert'

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
        strokeWidth="4"
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

const AddressInput = ({ placeholder, address, onChange }) => (
  <input
    placeholder={placeholder}
    type="string"
    value={address}
    onChange={onChange}
    required
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
)

const AmountInput = ({ amount, onChange }) => (
  <input
    placeholder="Amount (>= 1 PUPPY)"
    type="number"
    step="1"
    value={amount < 1 ? '' : amount}
    onChange={onChange}
    required
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
)

const PuppyTokenPage = () => {
  const {
    tokenSymbol,
    tokenAmounts,
    transferPuppyToken,
    mintPuppyToken,
    burnPuppyToken,
    transferOwner,
    isTokenContractOwner,
    currentAccount
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
    const ok = await transferPuppyToken(addressTo, transferAmount)

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
        text: transferAmount + ' PUPPY have been transfered to ' + addressTo + '.'
      })
      setAddressTo('')
      setTransferAmount(0)
    }

    setIsTransferProcessing(false)
  }

  const handleMintToken = async (e) => {
    e.preventDefault()

    setIsMintProcessing(true)
    const ok = await mintPuppyToken(mintAmount)

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
        text: mintAmount + ' PUPPY have been minted.'
      })
      setMintAmount(0)
    }

    setIsMintProcessing(false)
  }

  const handleBurnToken = async (e) => {
    e.preventDefault()

    setIsBurnProcessing(true)
    const ok = await burnPuppyToken(burnAddress, burnAmount)

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
        text: burnAmount + ' PUPPY from address ' + burnAddress + ' have been burned.'
      })
      setBurnAddress('')
      setBurnAmount(0)
    }

    setIsBurnProcessing(false)
  }

  const handleTransferOwner = async (e) => {
    e.preventDefault()

    setIsTransferOwnerProcessing(true)
    const ok = await transferOwner(newOwner)

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
        text: newOwner + ' has become the owner of PUPPY.'
      })
      setNewOwner('')
    }

    setIsTransferOwnerProcessing(false)
  }

  return (
    <div className="flex min-h-screen justify-center items-center gradient-bg-transactions">
      <div className="md:p-12 py-12 px-4">
        {currentAccount ? (
          <div className="m-auto p-3 min-w-[60vw] md:w-auto xl:max-w-[70vw]">
            {/* My Tokens */}
            <p className="text-xl text-white m-auto p-3 max-w-[90vw] xl:max-w-[70vw] md:w-auto">
              My Tokens
            </p>
            <div className="m-auto p-5 max-w-[90vw] xl:max-w-[70vw] md:w-auto rounded-lg border shadow-md border-gray-700 bg-gray-800">
              <div className="flex items-center space-x-4">
                <img src="/puppy_token_icon.png" alt="token_icon" className="h-16 cursor-pointer" />
                <div className="space-y-1 font-medium text-white">
                  <div>{tokenSymbol}</div>
                  <div className="text-sm text-gray-400">{tokenAmounts}</div>
                </div>
              </div>
            </div>

            {/* User's Operation */}
            <p className="text-xl mt-2 text-white m-auto p-3 max-w-[90vw] xl:max-w-[70vw] md:w-auto">
              My Operation
            </p>
            <div className="m-auto p-5 max-w-[90vw] xl:max-w-[70vw] md:w-auto rounded-lg border shadow-md border-gray-700 bg-gray-800">
              <div className="space-y-1 font-medium text-white">Transfer</div>
              <AddressInput
                placeholder="To"
                address={addressTo}
                onChange={(e) => setAddressTo(e.target.value)}
              />
              <AmountInput
                amount={transferAmount}
                onChange={(e) => setTransferAmount(Number.parseInt(e.target.value))}
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

            {isTokenContractOwner ? (
              <div>
                {/* Owner's Operation */}
                <p className="text-xl mt-2 text-white m-auto p-3 max-w-[90vw] xl:max-w-[70vw] md:w-auto">
                  Owner's Operation
                </p>
                <div className="m-auto p-5 max-w-[90vw] xl:max-w-[70vw] md:w-auto rounded-lg border shadow-md border-gray-700 bg-gray-800">
                  <div className="space-y-1 font-medium text-white">Mint PUPPY token</div>
                  <AmountInput
                    amount={mintAmount}
                    onChange={(e) => setMintAmount(Number.parseInt(e.target.value))}
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
                  <AddressInput
                    placeholder="From"
                    address={burnAddress}
                    onChange={(e) => setBurnAddress(e.target.value)}
                  />
                  <AmountInput
                    amount={burnAmount}
                    onChange={(e) => setBurnAmount(Number.parseInt(e.target.value))}
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
                <div className="m-auto p-5 mt-5 max-w-[90vw] xl:max-w-[70vw] md:w-auto rounded-lg border shadow-md border-gray-700 bg-gray-800">
                  <div className="space-y-1 font-medium text-white">Change PUPPY owner</div>
                  <AddressInput
                    placeholder="New Owner Address"
                    address={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
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
            ) : (
              <div></div>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:p-12 py-12 px-4">
            <h3 className="text-white text-3xl text-center my-2">
              Connect your account to see your tokens and do operations
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default PuppyTokenPage
