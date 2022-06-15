import React, { useContext } from 'react'
import { transactionContext } from '../context/TransactionContext'
import { PuppyCard } from './PuppyCard'

const Puppies = () => {
  const { puppies, currentAccount } = useContext(transactionContext)

  return (
    <div className="flex w-full min-h-screen justify-center items-center 2xl:px-20 gradient-bg-transactions">
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
