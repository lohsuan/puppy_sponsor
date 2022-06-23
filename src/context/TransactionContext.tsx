import React, { useEffect, useState } from 'react'
import type { Contract, ContractReceipt, ContractTransaction } from 'ethers'
import { ethers, providers } from 'ethers'
import { contractABI, contractAddress, tokenABI, tokenAddress } from '../utils/constants'
import { useSetState, useToggle } from 'react-use'
import Swal from 'sweetalert'

export const transactionContext = React.createContext({})

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

const createEthereumContractClient = (
  address: string,
  ABI: ethers.ContractInterface
): Contract | undefined => {
  if (!ethereumProvider) {
    Swal({
      icon: 'info',
      title: 'Please install MetaMask!'
    }).then()
    return undefined
  }

  const provider = new ethers.providers.Web3Provider(ethereumProvider)
  const signer = provider.getSigner()
  return new ethers.Contract(address, ABI, signer)
}

const defaultDonationFormData = { amount: '', keyword: '', message: '' }

export const TransactionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [donationFormData, setDonationFormData] = useSetState(defaultDonationFormData)
  const [currentAccount, setCurrentAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [puppies, setPuppies] = useState([])
  const [tokenAmounts, setTokenAmounts] = useState(0)
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [isTokenContractOwner, setIsTokenContractOwner] = useToggle(false)

  const contract = createEthereumContractClient(contractAddress, contractABI)
  const puppyToken = createEthereumContractClient(tokenAddress, tokenABI)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string): void => {
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
    await checkTokenContractOwner()
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
      if (ethereumProvider && contract) {
        const availableTransactions = await contract.getAllDonateTransactions()
        console.info('availableTransactions', availableTransactions)

        const structuredTransactions = availableTransactions.map((transaction: any) => ({
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
    return contract ? (await contract.owner()).toLowerCase() : ''
  }

  const getAllPuppies = async (): Promise<void> => {
    try {
      if (ethereumProvider && contract) {
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
      if (ethereumProvider && puppyToken) {
        const accounts = await ethereumProvider.request!({ method: 'eth_requestAccounts' })
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
      if (ethereumProvider && puppyToken) {
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
  ): Promise<ContractReceipt | undefined> => {
    if (isLoading) {
      return
    }

    try {
      if (!ethereumProvider) {
        console.info('No ethereum object')
        return
      }

      if (!puppyToken) {
        console.warn('puppyToken contract client is not initialized')
        return
      }

      // TODO: check if `amount` exceeds solidity uint256
      const contractTx = await puppyToken.transfer(to, amount)

      return transactionPromise(contractTx)
    } catch (e) {
      console.warn('An error occurred during transferPuppyToken', e)
    }
  }

  const mintPuppyToken = async (amount: number): Promise<ContractReceipt | undefined> => {
    if (isLoading) {
      return
    }

    try {
      if (!ethereumProvider) {
        console.info('No ethereum object')
        return
      }

      if (!puppyToken) {
        console.warn('puppyToken contract client is not initialized')
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
  ): Promise<ContractReceipt | undefined> => {
    if (isLoading) {
      return
    }

    try {
      if (!ethereumProvider) {
        console.info('No ethereum object')
        return
      }

      if (!puppyToken) {
        console.warn('puppyToken contract client is not initialized')
        return
      }

      // TODO: check if `amount` exceeds solidity uint256
      const contractTx = await puppyToken.burn(address, amount)

      return transactionPromise(contractTx)
    } catch (e) {
      console.warn('An error occurred during burnPuppyToken', e)
    }
  }

  const transferOwner = async (newOwner: NonEmptyString): Promise<ContractReceipt | undefined> => {
    if (isLoading) {
      return
    }

    try {
      if (!ethereumProvider) {
        console.info('No ethereum object')
        return
      }

      if (!puppyToken) {
        console.warn('puppyToken contract client is not initialized')
        return
      }

      const contractTx = await puppyToken.transferOwnership(newOwner)

      return transactionPromise(contractTx)
    } catch (e) {
      await Swal({
        icon: 'info',
        title:
          'Something went wrong.\n Check if the address is valid, \n and you have the right to change owner.'
      })
      console.warn('An error occurred during transferOwner', e)
    }
  }

  const checkTokenContractOwner = async (): Promise<string | undefined> => {
    try {
      if (ethereumProvider && puppyToken) {
        const accounts = await ethereumProvider.request!({ method: 'eth_requestAccounts' })
        let owner = (await puppyToken.owner()).toLowerCase()

        console.info('tokenOwner', owner)

        if (owner === accounts[0]) {
          setIsTokenContractOwner(true)
        }
      } else {
        console.info('Ethereum is not present')
      }
    } catch (error) {
      console.warn(error)
      return
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

      const accounts = await ethereumProvider.request!({ method: 'eth_accounts' })

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

      const accounts = await ethereumProvider.request!({ method: 'eth_requestAccounts' })

      setCurrentAccount(accounts[0].toLowerCase())
    } catch (error) {
      console.warn('No ethereum object', error)
    }
  }

  const donateForFood = async (): Promise<ContractReceipt | undefined> => {
    if (isLoading) {
      return
    }

    try {
      if (ethereumProvider && contract) {
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

  const donateForPuppy = async (puppyId: string): Promise<ContractReceipt | undefined> => {
    if (isLoading) {
      return
    }

    try {
      if (ethereumProvider && contract) {
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

  const createNewPuppy = async (
    newPuppyInfo: NewPuppyInfo
  ): Promise<ContractReceipt | undefined> => {
    if (isLoading) {
      return
    }

    try {
      if (!ethereumProvider) {
        console.info('No ethereum object')
        return
      }

      if (!contract) {
        console.warn('puppySponsor contract client is not initialized')
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
        isTokenContractOwner,
        formData: donationFormData
      }}
    >
      {children}
    </transactionContext.Provider>
  )
}
