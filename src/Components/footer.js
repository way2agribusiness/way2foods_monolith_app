import React from "react";
import { FaFacebookF, FaPhoneAlt, FaChevronRight } from "react-icons/fa";
import {
    FaLinkedin,
    FaInstagram,
    FaSquareXTwitter,
    FaLocationDot,
} from "react-icons/fa6";
import { BsEnvelopeAt } from "react-icons/bs";

const Footer = () => {
    return (
        <footer id="footer" className="text-xs bg-[#333] text-gray-200 pt-16 pb-4">
            <div className="container mx-auto px-4">
                {/* Footer Top */}
                <div className="flex flex-wrap justify-between mb-2">
                    {/* Company Info (Way2Foods) */}
                    <div className="w-full sm:w-1/3 mb-8">
                        <h3 className="text-xl font-bold mb-6">Way2Foods</h3>
                        <p className="text-gray-400 mb-6">
                            Connecting farmers and consumers through a <br />
                            sustainable marketplace
                            for fresh produce.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FaFacebookF />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FaSquareXTwitter />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links, Customer Service, and Contact Us in Same Section */}
                    <div className="w-full sm:w-2/3 flex flex-wrap mb-8">
                        {/* Quick Links */}
                        <div className="w-1/2 sm:w-1/3 pr-4 mb-8 sm:mb-0">
                            <h4 className="text-md font-semibold mb-6">Quick Links</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-yellow-300 transition-colors flex items-center"
                                    >
                                        <FaChevronRight className="text-xs mr-2" /> About Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-yellow-300 transition-colors flex items-center"
                                    >
                                        <FaChevronRight className="text-xs mr-2" /> Our Products
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-yellow-300 transition-colors flex items-center"
                                    >
                                        <FaChevronRight className="text-xs mr-2" /> APMC Partners
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-yellow-300 transition-colors flex items-center"
                                    >
                                        <FaChevronRight className="text-xs mr-2" /> FPO Network
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://medium.com/@way2agribusiness"
                                        className="text-gray-400 hover:text-yellow-300 transition-colors flex items-center"
                                    >
                                        <FaChevronRight className="text-xs mr-2" /> Blog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Customer Service */}
                        <div className="w-1/2 sm:w-1/3 pr-4 mb-8 sm:mb-0">
                            <h4 className="text-md font-semibold mb-6">Customer Service</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-yellow-300 transition-colors flex items-center"
                                    >
                                        <FaChevronRight className="text-xs mr-2" /> Help Center
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-yellow-300 transition-colors flex items-center"
                                    >
                                        <FaChevronRight className="text-xs mr-2" /> Returns & Refunds
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-yellow-300 transition-colors flex items-center"
                                    >
                                        <FaChevronRight className="text-xs mr-2" /> Shipping Policy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-yellow-300 transition-colors flex items-center"
                                    >
                                        <FaChevronRight className="text-xs mr-2" /> Terms & Conditions
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='#'
                                        className="text-gray-400 hover:text-yellow-300 transition-colors flex items-center"
                                    >
                                        <FaChevronRight className="text-xs mr-2" /> Privacy Policy
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Us */}
                        <div className="w-full sm:w-1/3">
                            <h4 className="text-md font-semibold mb-6">Contact Us</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <FaLocationDot className="mt-1 mr-3 text-green-500" />
                                    <span className="text-gray-400">
                                        #636, BDA Block 2, APMC (RMC) Yard, Yeshwanthpura, Bengaluru - 560022
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <FaPhoneAlt className="mr-3 text-green-500" />
                                    <span className="text-gray-400">9449004956</span>
                                </li>
                                <li className="flex items-center">
                                    <BsEnvelopeAt className="mr-3 text-green-500" />
                                    <span className="text-gray-400">way2foods@gmail.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div>
                    <div className="mt-2">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3203.9950139343064!2d77.54525550206137!3d13.01582557703085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3dee4ecb4101%3A0x25bea90d09b46f03!2sWay2Foods!5e1!3m2!1sen!2sin!4v1737520943722!5m2!1sen!2sin"
                            width="100%"  // Responsive width
                            height="200"  // Height adjusted to match your design
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Way2Foods Location Map"
                        ></iframe>
                    </div>

                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 pt-4">
                    <div className="text-center text-gray-400 text-sm">
                        <p>© Way2Foods. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;