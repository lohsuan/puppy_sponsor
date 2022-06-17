import React from 'react'
import { BsShieldFillCheck } from 'react-icons/bs'
import { BiSearchAlt } from 'react-icons/bi'
import { RiHeart2Fill } from 'react-icons/ri'
import { contractAddress, tokenAddress } from '../utils/constants'
import { shortenAddress } from '../utils/shortenAddress'

const ServiceCard = ({ color, title, icon, subtitle }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl">
    <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>{icon}</div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-1 text-white text-sm md:w-9/12">{subtitle}</p>
    </div>
  </div>
)

const Services = () => (
  <div className="flex w-full justify-center items-center gradient-bg-services">
    <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
      <div className="flex-1 flex flex-col justify-start items-start">
        <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">Services we Provide</h1>
        <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
          Offer you convenient, transparent and rapid services to donate safely around the world.
        </p>
        <a
          href={`https://ropsten.etherscan.io/address/${contractAddress}`}
          target="_blank"
          rel="noreferrer"
          className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base hover:text-blue-400"
        >
          <p>
            Contract address: {shortenAddress(contractAddress)}
          </p>
        </a>
        <a
          href={`https://ropsten.etherscan.io/address/${tokenAddress}`}
          target="_blank"
          rel="noreferrer"
          className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base hover:text-blue-400"
        >
          <p>
            Token address: {shortenAddress(tokenAddress)}
          </p>
        </a>
      </div>

      <div className="flex-1 flex flex-col justify-start items-center">
        <ServiceCard
          color="bg-[#2952E3]"
          title="Security gurantee"
          icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
          subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
        />
        <ServiceCard
          color="bg-[#8945F8]"
          title="Fastest transactions"
          icon={<BiSearchAlt fontSize={21} className="text-white" />}
          subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
        />
        <ServiceCard
          color="bg-[#F84550]"
          title="Record your love"
          icon={<RiHeart2Fill fontSize={21} className="text-white" />}
          subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
        />
      </div>
    </div>
  </div>
)

export default Services
