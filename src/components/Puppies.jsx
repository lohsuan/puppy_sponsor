import React, { useContext } from 'react'
import { transactionContext } from '../context/TransactionContext'
import { Link } from 'react-router-dom'

const PuppyCard = ({ puppyId, imageUrl, name, birthday, description }) => {
  return (
    <div
      className="bg-[#181918] m-4 flex flex-1 2xl:min-w-[300px] 2xl:max-w-[350px] sm:min-w-[270px] sm:max-w-[300px]
                         min-w-full flex-col p-3 rounded-md hover:shadow-2xl"
    >
      <div className="flex flex-col justify-between items-center h-full w-full mt-3">
        <div className="display-flex justify-start w-full mb-6 p-2">
          <p className="text-white text-base">Name: {name}</p>
          <p className="text-white text-base">Birthday: {birthday}</p>
          <p className="text-white text-base">Description: {description}</p>
        </div>

        <div className="flex flex-col items-center">
          <img src={imageUrl} alt="dog" />
          <Link to={'/puppies/' + puppyId}>
            <div className="bg-black p-3 px-5 w-max rounded-3xl -translate-y-1/2 shadow-2xl">
              <p className="text-[#37c7da] font-bold">Donate to XXX</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

const Puppies = () => {
  const { puppies, currentAccount } = useContext(transactionContext)

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <h3 className="text-white text-3xl text-center my-2">All Puppies</h3>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the cute puppies
          </h3>
        )}

        <div className="flex flex-wrap justify-center items-stretch mt-10">
          {puppies && puppies.map((puppyDetail, i) => <PuppyCard key={i} {...puppyDetail} />)}
        </div>
      </div>
    </div>
  )
}

export default Puppies
