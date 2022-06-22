import React, { useEffect, useState } from 'react'
import type { Contract, ContractReceipt, ContractTransaction } from 'ethers'
import { ethers, providers } from 'ethers'

import { contractABI, contractAddress, tokenABI, tokenAddress } from '../utils/constants'
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

const createEthereumContractClient = (address, ABI): Contract => {
  if (!ethereumProvider) {
    Swal({
      icon: 'info',
      title: 'Please install MetaMask!'
    }).then()
    return
  }

  const provider = new ethers.providers.Web3Provider(ethereumProvider)
  const signer = provider.getSigner()
  return new ethers.Contract(address, ABI, signer)
}

const defaultDonationFormData = { amount: '', keyword: '', message: '' }

export const TransactionsProvider = ({ children }) => {
  const [donationFormData, setDonationFormData] = useSetState(defaultDonationFormData)
  const [currentAccount, setCurrentAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [puppies, setPuppies] = useState([])
  const [tokenAmounts, setTokenAmounts] = useState(0)
  const [tokenSymbol, setTokenSymbol] = useState('')

  const contract = createEthereumContractClient(contractAddress, contractABI)
  const puppyToken = createEthereumContractClient(tokenAddress, tokenABI)

  const handleChange = (e: React.FormEvent<HTMLInputElement>, name: string): void => {
    setDonationFormData((prevState: typeof donationFormData) => ({
      ...prevState,
      [name]: e.target.value
    }))
  }

  const updateChainContents = async (): Promise<void> => {
    await getAllPuppies()
    await getPuppyTokenSymbol()
    await getAllTransactions()
    await getPuppyTokenBalance()
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
          amount: Number.parseInt(transaction.amount._hex) / 10 ** 18,
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

  const getPuppyTokenBalance = async (): Promise<void> => {
    try {
      if (ethereumProvider) {
        const accounts = await ethereumProvider.request({ method: 'eth_requestAccounts' })
        let tokenBalance = await puppyToken.balanceOf(accounts[0])
        tokenBalance = Number.parseInt(tokenBalance._hex)

        console.info('tokenBalance', tokenBalance)

        setTokenAmounts(tokenBalance)
      } else {
        console.info('Ethereum is not present')
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const getPuppyTokenSymbol = async (): Promise<void> => {
    try {
      if (ethereumProvider) {
        let symbol = await puppyToken.symbol()

        console.info('symbol', symbol)

        setTokenSymbol(symbol)
      } else {
        console.info('Ethereum is not present')
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const transferPuppyToken = async (
    to: NonEmptyString,
    amount: number
  ): Promise<ContractReceipt> => {
    if (isLoading) {
      return
    }

    try {
      if (!ethereumProvider) {
        console.info('No ethereum object')
        return
      }

      // TODO: check if `amount` exceeds solidity uint256
      const contractTx = await puppyToken.transfer(to, amount)

      return transactionPromise(contractTx)
    } catch (e) {
      console.warn('An error occurred during transferPuppyToken', e)
    }
  }

  const mintPuppyToken = async (amount: number): Promise<ContractReceipt> => {
    if (isLoading) {
      return
    }

    try {
      if (!ethereumProvider) {
        console.info('No ethereum object')
        return
      }

      // TODO: check if `amount` exceeds solidity uint256
      const contractTx = await puppyToken.mint(amount)

      return transactionPromise(contractTx)
    } catch (e) {
      console.warn('An error occurred during mintPuppyToken', e)
    }
  }

  const burnPuppyToken = async (
    address: NonEmptyString,
    amount: number
  ): Promise<ContractReceipt> => {
    if (isLoading) {
      return
    }

    try {
      if (!ethereumProvider) {
        console.info('No ethereum object')
        return
      }

      // TODO: check if `amount` exceeds solidity uint256
      const contractTx = await puppyToken.burn(address, amount)

      return transactionPromise(contractTx)
    } catch (e) {
      console.warn('An error occurred during burnPuppyToken', e)
    }
  }

  const transferOwner = async (
    newOwner: NonEmptyString
  ): Promise<ContractReceipt> => {
    if (isLoading) {
      return
    }

    try {
      if (!ethereumProvider) {
        console.info('No ethereum object')
        return
      }

      const contractTx = await puppyToken.transferOwnership(newOwner)

      return transactionPromise(contractTx)
    } catch (e) {
      await Swal({
        icon: 'info',
        title: 'Something went wrong.\n Check if the address is valid, \n and you have the right to change owner.'
      })
      console.warn('An error occurred during transferOwner', e)
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
        tokenAmounts,
        tokenSymbol,
        transferPuppyToken,
        mintPuppyToken,
        burnPuppyToken,
        transferOwner,
        formData: donationFormData
      }}
    >
      {children}
    </transactionContext.Provider>
  )
}
