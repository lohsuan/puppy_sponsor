import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { transactionContext } from '../context/TransactionContext'
import { Loader } from '.'
import { shortenAddress } from '../utils/shortenAddress'
import { useToggle } from 'react-use'
import Swal from 'sweetalert'

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.001"
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
  const { handleChange, puppies, donateForPuppy, formData, transactions } =
    useContext(transactionContext)
  const params = useParams()
  const puppy = puppies.find((puppy) => puppy.puppyId === params.id)
  const [isProcessing, setIsProcessing] = useToggle(false)

  const handleSubmit = async (e) => {
    const { amount, keyword, message } = formData
    e.preventDefault()

    if (!amount || !keyword || !message) return

    if (amount < 0.001) {
      await Swal({
        icon: 'warning',
        title: 'Sorry :(',
        text: 'Donation amount should be greater than 0.001.'
      })
      return
    }

    setIsProcessing(true)
    const ok = await donateForPuppy(puppy.puppyId)

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
        text:
          'Thank you!\nYou have donated ' +
          amount +
          ' ETH to ' +
          puppy.name +
          '!\n You will get ' +
          Math.floor(amount * 1000) +
          ' PUPPY TOKEN from us as a reward.'
      })
    }

    setIsProcessing(false)
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center  justify-center px-5 md:max-w-[70vw] m-auto">
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
                placeholder="Amount (>= 0.001 ETH)"
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

              {isProcessing ? (
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
      <div className="relative overflow-x-auto shadow-md rounded-lg max-w-full m-2">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
              {['Donator', 'Amount', 'Message', 'Transaction Time'].map((v, i) => (
                <th key={i} scope="col" className="px-6 py-3">
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions &&
              transactions
                .filter((x) => x.puppyId === params.id)
                .reverse()
                .map((transaction, i) => (
                  <tr key={i} className=" border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                      <a
                        href={`https://ropsten.etherscan.io/address/${transaction.addressFrom}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <p className="text-white text-base hover:text-blue-400">
                          {shortenAddress(transaction.addressFrom)}
                        </p>
                      </a>
                    </th>
                    <td className="px-6 py-4 text-right">
                      {transaction.amount} <b className="text-cyan-300 text-xs">ETH</b>
                    </td>
                    <td className="px-6 py-4">{transaction.message}</td>
                    <td className="px-6 py-4">{transaction.time}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PuppyDetail
