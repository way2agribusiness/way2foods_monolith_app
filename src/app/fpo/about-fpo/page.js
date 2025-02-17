'use client';
import React from "react";
import {
    FaLocationDot,
    FaStore,
    FaHandshakeSimple,
    FaTruckFast,
    FaUsers,
} from "react-icons/fa6";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { MdOutlineCurrencyRupee } from "react-icons/md";

const FPO = () => {
    return (
        <div id="root">
            <section id="apmcPartners" className="py-0 bg-white">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="text-center mb-4">
                        <span className="text-green-700 font-medium text-sm mt-0">
                            EMPOWERING FARMERS
                        </span>
                        <h2 className="text-xl font-bold text-gray-800 mt-2 mb-2">
                            Farmer Producer Organizations
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We collaborate with FPOs Supporting local farmer collectives to
                            bring you premium quality produce while ensuring fair returns to
                            farming communities.
                        </p>
                    </div>

                    {/* Partners Grid (Responsive) */}
                    <div className="py-0">
                        {/* Mobile: Scrollable, Desktop: Grid with proper spacing */}
                        <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:overflow-hidden py-4">
                            <div className="flex sm:grid sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 min-w-max sm:min-w-0">
                                {/* Partner Card 1 */}
                                <div className="w-80 sm:w-auto bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FaStore className="text-3xl text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                Bengaluru FPO
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                A key hub for Farmer Producer Organizations (FPOs),
                                                known for its high-quality vegetables and fruits.
                                            </p>
                                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                                <span className="flex items-center">
                                                    <FaLocationDot className="mr-2 text-green-600" />
                                                    Bengaluru
                                                </span>
                                                <span className="flex items-center">
                                                    <FaHandshakeSimple className="mr-2 text-green-600" />
                                                    150+ Vendors
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Partner Card 2 */}
                                <div className="w-80 sm:w-auto bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FaStore className="text-3xl text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                Kolar FPO
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                A key group of local farmers, focused on improving
                                                market access and growing their agricultural businesses.
                                            </p>
                                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                                <span className="flex items-center">
                                                    <FaLocationDot className="mr-2 text-green-600" />
                                                    Kolar
                                                </span>
                                                <span className="flex items-center">
                                                    <FaHandshakeSimple className="mr-2 text-green-600" />
                                                    120+ Vendors
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Partner Card 3 */}
                                <div className="w-80 sm:w-auto bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FaStore className="text-3xl text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                Mandya FPO
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                A collective of local farmers working together to
                                                enhance market access and improve agricultural
                                                practices.
                                            </p>
                                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                                <span className="flex items-center">
                                                    <FaLocationDot className="mr-2 text-green-600" />
                                                    Mandya
                                                </span>
                                                <span className="flex items-center">
                                                    <FaHandshakeSimple className="mr-2 text-green-600" />
                                                    90+ Vendors
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Benefits Section (Responsive) */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaUsers className="text-2xl text-green-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                Quality Assured
                            </h4>
                            <p className="text-gray-600">
                                All products undergo strict quality checks at FPOs
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTruckFast className="text-2xl text-green-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                Direct Supply
                            </h4>
                            <p className="text-gray-600">
                                Fresh produce directly from FPOs to your doorstep
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MdOutlineCurrencyRupee className="text-2xl text-green-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                Fair Pricing
                            </h4>
                            <p className="text-gray-600">
                                Transparent pricing based on daily FPO rates
                            </p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mt-4">
                        <a
                            href="#"
                            className="inline-flex items-center bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
                        >
                            <span className="mr-2">View All FPO Products</span>
                            <i className="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FPO;