import logo from "../assets/logo.png"
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useState, useEffect } from 'react';

function Navbar() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const handleAuthChange = () => {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);

            const user = JSON.parse(localStorage.getItem("user") || "{}");
            setIsAdmin(user.role === "admin");
        };

        handleAuthChange(); // run once on load

        window.addEventListener("authChange", handleAuthChange);
        window.addEventListener("storage", handleAuthChange);

        return () => {
            window.removeEventListener("authChange", handleAuthChange);
            window.removeEventListener("storage", handleAuthChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
    };

    return (
        <div className="fixed w-full z-50 bg-[#003A6B] flex gap-10 p-2">
            <Link to="/">
            <img src={logo} className="w-15 h-15 bg-black object-contain rounded-xl" alt="Urban Move Logo" />
             </Link>
            <div className="flex w-full justify-end pr-10">
                <ol className="flex gap-10 pt-5">
                    <div className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-md">
                        <li><Link to="/" className="" ><h3>Home</h3></Link></li>
                    </div>
                    <div className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-md">
                        <li><Link to="/Map" className="" ><h3>Map</h3></Link></li>
                    </div>


                    {!isLoggedIn && (
                        <li className="pr-4">
                            <div className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-md">
                                <Link to="/login"><h3>Login</h3></Link>
                            </div>

                        </li>
                    )}
                </ol>

                <Menu as="div" className="relative inline-block pt-3 pl-3">
                    <MenuButton className="brat inline-flex justify-center ml-6 rounded-md bg-black px-4 py-2 text-lg mt-1.5 text-white hover:bg-gray-800 transition-colors">
                        Options
                    </MenuButton>

                    <MenuItems className="absolute right-0 z-10 mt-2 w-56 rounded-md bg-gray-800">
                        <div className="py-1">

                            {isAdmin && (
                                <MenuItem>
                                    <Link
                                        to="/admindashboard"
                                        className="block px-4 py-2 text-sm font-semibold text-red-400 hover:bg-white/5"
                                    >
                                        Admin Panel
                                    </Link>
                                </MenuItem>
                            )}

                            {isLoggedIn && (
                                <>
                                    <MenuItem>
                                        <Link to="/Profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                                            Profile
                                        </Link>
                                    </MenuItem>

                                    <MenuItem>
                                        <Link to="/Rides" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                                            Ride
                                        </Link>
                                    </MenuItem>
                                </>
                            )}

                            <MenuItem>
                                {isLoggedIn ? (
                                    <div className="">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full">
                                        Sign out
                                    </button>
                                    </div>
                                ) : (
                                    <Link to="/login" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                                        Login
                                    </Link>
                                )}
                            </MenuItem>

                        </div>
                    </MenuItems>
                </Menu>
            </div>
        </div>
    );
}

export default Navbar;
