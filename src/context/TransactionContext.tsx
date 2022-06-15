import React, { useEffect, useState } from 'react'
import type { Contract, ContractReceipt, ContractTransaction } from 'ethers'
import { ethers, providers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'
import { useSetState } from 'react-use'
import Swal from 'sweetalert'

export const transactionContext = React.createContext(undefined, undefined)

declare global {
  interface Window {
    ethereum?: providers.ExternalProvider
  }
}

export type NonEmptyString = Readonly<NonNullable<Exclude<string, ''>>>

export interface NewPuppyInfo {
  name: NonEmptyString
  birthday: NonEmptyString
  imageUrl: NonEmptyString
  description?: Readonly<string>
}

const globalWindow: Window = window
const ethereumProvider = globalWindow.ethereum

const createEthereumContractClient = (): Contract => {
  if (!ethereumProvider) {
    Swal({
      icon: 'info',
      title: 'Please install MetaMask!'
    }).then()
    return
  }

  const provider = new ethers.providers.Web3Provider(ethereumProvider)
  const signer = provider.getSigner()
  return new ethers.Contract(contractAddress, contractABI, signer)
}

const defaultDonationFormData = { amount: '', keyword: '', message: '' }

export const TransactionsProvider = ({ children }) => {
  const [donationFormData, setDonationFormData] = useSetState(defaultDonationFormData)
  const [currentAccount, setCurrentAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [puppies, setPuppies] = useState([])

  const contract = createEthereumContractClient()

  const handleChange = (e: React.FormEvent<HTMLInputElement>, name: string): void => {
    setDonationFormData((prevState: typeof donationFormData) => ({
      ...prevState,
      [name]: e.target.value
    }))
  }

  const updateChainContents = async (): Promise<void> => {
    await getAllPuppies()
    await getAllTransactions()
  }

  const transactionPromise = (transaction: ContractTransaction): Promise<ContractReceipt> => {
    setIsLoading(true)
    console.info(`Loading - ${transaction.hash}`)

    const txPromise = transaction.wait()

    txPromise.then(() => {
      console.info(`Done - ${transaction.hash}`)
      setDonationFormData(defaultDonationFormData)
      updateChainContents().then(() => setIsLoading(false))
    })

    return txPromise
  }

  const getAllTransactions = async (): Promise<void> => {
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

  const owner = async (): Promise<string> => {
    return (await contract.owner()).toLowerCase()
  }

  const getAllPuppies = async (): Promise<void> => {
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

  const checkIfWalletIsConnect = async (): Promise<void> => {
    try {
      if (!ethereumProvider) {
        await Swal({
          icon: 'info',
          title: 'Please install MetaMask!'
        })
        return
      }

      const accounts = await ethereumProvider.request({ method: 'eth_accounts' })

      if (accounts.length) {
        setCurrentAccount(accounts[0])
        await updateChainContents()
      } else {
        console.info('No accounts found')
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const connectWallet = async (): Promise<void> => {
    try {
      if (!ethereumProvider) {
        await Swal({
          icon: 'info',
          title: 'Please install MetaMask!'
        })
        return
      }

      const accounts = await ethereumProvider.request({ method: 'eth_requestAccounts' })

      setCurrentAccount(accounts[0].toLowerCase())
    } catch (error) {
      console.warn('No ethereum object', error)
    }
  }

  const donateForFood = async (): Promise<ContractReceipt> => {
    if (isLoading) {
      return
    }

    try {
      if (ethereumProvider) {
        const { amount, keyword, message } = donationFormData

        const options = { value: ethers.utils.parseEther(amount) }
        const contractTx = await contract.donateForFood(message, keyword, options)

        return transactionPromise(contractTx)
      } else {
        console.info('No ethereum object')
      }
    } catch (error) {
      console.warn('No ethereum object', error)
    }
  }

  const donateForPuppy = async (puppyId): Promise<ContractReceipt> => {
    if (isLoading) {
      return
    }

    try {
      if (ethereumProvider) {
        const { amount, keyword, message } = donationFormData

        const options = { value: ethers.utils.parseEther(amount) }
        const contractTx = await contract.donateForPuppy(puppyId, message, keyword, options)

        return transactionPromise(contractTx)
      } else {
        console.info('No ethereum object')
      }
    } catch (error) {
      console.warn('No ethereum object', error)
    }
  }

  const createNewPuppy = async (newPuppyInfo: NewPuppyInfo): Promise<ContractReceipt> => {
    if (isLoading) {
      return
    }

    try {
      if (!ethereumProvider) {
        console.info('No ethereum object')
        return
      }

      const contractTx = await contract.createNewPuppy(
        newPuppyInfo.name,
        newPuppyInfo.birthday,
        newPuppyInfo.imageUrl,
        newPuppyInfo.description
      )

      return transactionPromise(contractTx)
    } catch (e) {
      console.warn('An error occurred during createNewPuppy', e)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnect().then()
  }, [])

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
        createNewPuppy,
        handleChange,
        owner,
        formData: donationFormData
      }}
    >
      {children}
    </transactionContext.Provider>
  )
}
