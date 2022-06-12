import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'

export const transactionContext = React.createContext(undefined, undefined)

const { ethereum } = window

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  return new ethers.Contract(contractAddress, contractABI, signer)
}

export const TransactionsProvider = ({ children }) => {
  const [formData, setFormData] = useState({ amount: '', keyword: '', message: '' })
  const [currentAccount, setCurrentAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [donateTransactionAmount, setDonateTransactionAmount] = useState(
    localStorage.getItem('donateTransactionAmount')
  )
  const [transactions, setTransactions] = useState([])
  const [puppies, setPuppies] = useState([])

  const contract = createEthereumContract()

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const availableTransactions = await contract.getAllDonateTransactions()
        console.log('availableTransactions', availableTransactions)

        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressFrom: transaction.donor,
          addressTo: transaction.receiver,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
          time: new Date(transaction.time.toNumber() * 1000).toLocaleString(),
          puppyId: transaction.puppyId,
          message: transaction.message,
          keyword: transaction.keyword
        }))

        setTransactions(structuredTransactions)
      } else {
        console.log('Ethereum is not present')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllPuppies = async () => {
    try {
      if (ethereum) {
        const availablePuppies = await contract.getAllPuppies()

        console.log('puppies', availablePuppies)

        setPuppies(availablePuppies)
      } else {
        console.log('Ethereum is not present')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask.')

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length) {
        setCurrentAccount(accounts[0])
        await getAllPuppies()
        await getAllTransactions()
      } else {
        console.log('No accounts found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const currentDonateTransactionAmount = await contract.donateTransactionAmount()

        window.localStorage.setItem('donateTransactionAmount', currentDonateTransactionAmount)
      }
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object')
    }
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask.')

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      setCurrentAccount(accounts[0])
      window.location.reload()
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object')
    }
  }

  const donateForFood = async () => {
    try {
      if (ethereum) {
        const { amount, keyword, message } = formData

        const options = { value: ethers.utils.parseEther(amount) }
        const transactionHash = await contract.donateForFood(message, keyword, options)

        setIsLoading(true)
        console.log(`Loading - ${transactionHash.hash}`)
        await transactionHash.wait()
        console.log(`Success - ${transactionHash.hash}`)
        setIsLoading(false)

        const transactionsCount = await contract.donateTransactionAmount()

        setDonateTransactionAmount(transactionsCount.toNumber())
        window.location.reload()
      } else {
        console.log('No ethereum object')
      }
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object')
    }
  }

  const donateForPuppy = async (puppyId) => {
    try {
      if (ethereum) {
        const { amount, keyword, message } = formData

        const options = { value: ethers.utils.parseEther(amount) }
        const transactionHash = await contract.donateForPuppy(puppyId, message, keyword, options)

        setIsLoading(true)
        console.log(`Loading - ${transactionHash.hash}`)
        await transactionHash.wait()
        console.log(`Success - ${transactionHash.hash}`)
        setIsLoading(false)

        const transactionsCount = await contract.donateTransactionAmount()

        setDonateTransactionAmount(transactionsCount.toNumber())
        window.location.reload()
      } else {
        console.log('No ethereum object')
      }
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnect()
    checkIfTransactionsExists()
  }, [donateTransactionAmount])

  return (
    <transactionContext.Provider
      value={{
        donateTransactionAmount,
        connectWallet,
        transactions,
        puppies,
        currentAccount,
        isLoading,
        donateForFood,
        donateForPuppy,
        handleChange,
        formData
      }}
    >
      {children}
    </transactionContext.Provider>
  )
}
