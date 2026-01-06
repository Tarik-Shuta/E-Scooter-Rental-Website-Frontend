import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#242424] text-gray-300 py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-bold text-white">Urban Move</h2>
                        <p className="text-sm text-gray-400">
                            Move smarter. Move greener. Move Urban.
                        </p>
                    </div>


                    <div className="flex gap-6 text-sm">
                        <Link
                            to="/map"
                            className="hover:text-white transition-colors"
                        >
                            Map
                        </Link>
                        <Link
                            to="/rides"
                            className="hover:text-white transition-colors"
                        >
                            Rides
                        </Link>
                        <Link
                            to="/profile"
                            className="hover:text-white transition-colors"
                        >
                            Profile
                        </Link>
                    </div>
                </div>

                <div className="border-t border-gray-700 my-6"></div>

                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Urban Move. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
