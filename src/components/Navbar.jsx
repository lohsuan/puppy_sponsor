import React, { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";

import logo from "../font_logo.png";

const NavBarItem = ({ title, classprops, path }) => (
    <Link to={"/" + path} className={`mx-4 cursor-pointer ${classprops}`}>{title}</Link>
);

const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false);

    return (
        <nav className="w-full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.6] flex-nowrap flex-row justify-center items-center">
                <Link to="/">
                    <img src={logo} alt="logo" className="h-16 cursor-pointer" />
                </Link>
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
                <NavBarItem title="Home" path="" />
                <NavBarItem title="Puppys" path="puppys" />
                <NavBarItem title="Love Records" path="transactions" />
                <NavBarItem title="My Records" path="my-transactions" />
            </ul>
            <div className="flex relative">
                {!toggleMenu && (
                    <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
                )}
                {toggleMenu && (
                    <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
                )}
                {toggleMenu && (
                    <ul className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
                                flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
                    >
                        <li className="text-xl w-full my-2">
                            <AiOutlineClose onClick={() => setToggleMenu(false)} />
                        </li>
                        <NavBarItem title="Home" classprops="my-2 text-lg" path="" />
                        <NavBarItem title="Puppys" classprops="my-2 text-lg" path="puppys" />
                        <NavBarItem title="Love Records" classprops="my-2 text-lg" path="transactions" />
                        <NavBarItem title="My Records" classprops="my-2 text-lg" path="my-transactions" />
                    </ul>
                )}
            </div>
        </nav>
    );
}
export default Navbar