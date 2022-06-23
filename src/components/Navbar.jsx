import React, { useState } from 'react'
import { HiMenuAlt4 } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'
import { Link } from 'react-router-dom'

const NavBarItem = ({ title, classprops, path }) => (
  <Link to={'/' + path} className={`mx-4 cursor-pointer ${classprops}`}>
    {title}
  </Link>
)

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false)

  return (
    <nav className="w-full flex lg:justify-center justify-between items-center p-4">
      <div className="lg:flex-[0.6] flex-nowrap flex-row justify-center items-center">
        <Link to="/">
          <img src="/font_logo.png" alt="logo" className="h-16 cursor-pointer" />
        </Link>
      </div>
      <ul className="text-white lg:flex hidden list-none flex-row justify-between items-center flex-initial">
        <NavBarItem title="Home" path="" />
        <NavBarItem title="Puppies" path="puppies" />
        <NavBarItem title="Love Records" path="transactions" />
        <NavBarItem title="My Records" path="my-transactions" />
        <NavBarItem title="Add Puppy" path="add-puppy" />
        <NavBarItem title="Puppy Token" path="token" />
      </ul>
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4
            fontSize={28}
            className="text-white lg:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <AiOutlineClose
            fontSize={28}
            className="text-white lg:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[55vw] h-screen shadow-2xl lg:hidden list-none
                                flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            <NavBarItem title="Home" classprops="my-2 text-lg" path="" />
            <NavBarItem title="Puppies" classprops="my-2 text-lg" path="puppies" />
            <NavBarItem title="Love Records" classprops="my-2 text-lg" path="transactions" />
            <NavBarItem title="My Records" classprops="my-2 text-lg" path="my-transactions" />
            <NavBarItem title="Add Puppy" classprops="my-2 text-lg" path="add-puppy" />
            <NavBarItem title="Puppy Token" classprops="my-2 text-lg" path="token" />
          </ul>
        )}
      </div>
    </nav>
  )
}
export default Navbar
