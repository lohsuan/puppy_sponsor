import React, { useEffect, useState } from 'react'
import { Contract, ethers, providers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'
import { useSetState } from 'react-use'

export const transactionContext = React.createContext(undefined, undefined)

declare global {
  interface Window {
    ethereum?: providers.ExternalProvider
  }
}

const globalWindow: Window = window
const ethereumProvider = globalWindow.ethereum

const createEthereumContractClient = (): Contract => {
  const provider = new ethers.providers.Web3Provider(ethereumProvider)
  const signer = provider.getSigner()
  return new ethers.Contract(contractAddress, contractABI, signer)
}

export const TransactionsProvider = ({ children }) => {
  const [formData, setFormData] = useSetState({ amount: '', keyword: '', message: '' })
  const [currentAccount, setCurrentAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [puppies, setPuppies] = useState([])

  const [txState, setTxState] = useSetState({})

  const contract = createEthereumContractClient()

  const handleChange = (e: React.FormEvent<HTMLInputElement>, name: string): void => {
    setFormData((prevState: typeof formData) => ({ ...prevState, [name]: e.target.value }))
  }

  const getAllTransactions = async () => {
    try {
      if (ethereumProvider) {
        const availableTransactions = await contract.getAllDonateTransactions()
        console.info('availableTransactions', availableTransactions)

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
        console.info('Ethereum is not present')
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const getAllPuppies = async () => {
    try {
      if (ethereumProvider) {
        const availablePuppies = await contract.getAllPuppies()

        console.info('puppies', availablePuppies)

        setPuppies(availablePuppies)
      } else {
        console.info('Ethereum is not present')
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereumProvider) return alert('Please install MetaMask.')

      const accounts = await ethereumProvider.request({ method: 'eth_accounts' })

      if (accounts.length) {
        setCurrentAccount(accounts[0])
        await getAllPuppies()
        await getAllTransactions()
      } else {
        console.info('No accounts found')
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const connectWallet = async () => {
    try {
      if (!ethereumProvider) return alert('Please install MetaMask.')

      const accounts = await ethereumProvider.request({ method: 'eth_requestAccounts' })

      setCurrentAccount(accounts[0])
      setTxState(() => {})
    } catch (error) {
      console.warn('No ethereum object', error)
    }
  }

  const donateForFood = async () => {
    try {
      if (ethereumProvider) {
        const { amount, keyword, message } = formData

        const options = { value: ethers.utils.parseEther(amount) }
        const transactionHash = await contract.donateForFood(message, keyword, options)

        setIsLoading(true)
        console.info(`Loading - ${transactionHash.hash}`)
        await transactionHash.wait()
        console.info(`Success - ${transactionHash.hash}`)
        setIsLoading(false)

        setTxState(() => {})
      } else {
        console.info('No ethereum object')
      }
    } catch (error) {
      console.warn('No ethereum object', error)
    }
  }

  const donateForPuppy = async (puppyId) => {
    try {
      if (ethereumProvider) {
        const { amount, keyword, message } = formData

        const options = { value: ethers.utils.parseEther(amount) }
        const transactionHash = await contract.donateForPuppy(puppyId, message, keyword, options)

        setIsLoading(true)
        console.info(`Loading - ${transactionHash.hash}`)
        await transactionHash.wait()
        console.info(`Success - ${transactionHash.hash}`)
        setIsLoading(false)

        setTxState(() => {})
      } else {
        console.info('No ethereum object')
      }
    } catch (error) {
      console.warn('No ethereum object', error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnect().then()
  }, [txState])

  return (
    <transactionContext.Provider
      value={{
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
