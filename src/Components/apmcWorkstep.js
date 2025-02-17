import React from "react";
import { FaLocationDot, FaHandshakeSimple, FaTruckFast } from "react-icons/fa6";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { GiShop } from "react-icons/gi";

const APMCPartners = () => {
    return (
        <div id="root">
            <section id="apmcPartners" className="py-0 bg-white pb-5">
                <div className="container mx-auto px-4 text-xs">
                    {/* Section Header */}
                    <div className="text-center mb-4">
                        <span className="text-green-700 font-medium text-md">
                            TRUSTED PARTNERS
                        </span>
                        <h2 className="font-bold text-gray-800 text-xl mb-1">
                            Our APMC Market Partners
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We collaborate with Agricultural Produce Market Committee (APMC)
                            markets across the region to bring you the freshest produce
                            directly from registered traders.
                        </p>
                    </div>

                    {/* Partners Grid - Mobile */}
                    <div className="lg:hidden overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex space-x-4 pb-4 min-w-max">
                            {/* Partner Card 1 */}
                            <div className="w-80 flex-shrink-0">
                                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <GiShop className="text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">
                                                Yeshwantpur APMC Market
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Karnataka's largest APMC market, known for quality
                                                vegetables and fruits.
                                            </p>
                                            <div className="flex items-center text-gray-500 space-x-4">
                                                <span className="flex items-center">
                                                    <FaLocationDot className="mr-2 text-green-600" />
                                                    Yeshwantpur, Bengaluru
                                                </span>
                                                <span className="flex items-center">
                                                    <FaHandshakeSimple className="mr-2 text-green-600" />
                                                    150+ Vendors
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Partner Card 2 */}
                            <div className="w-80 flex-shrink-0">
                                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <GiShop className="text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">
                                                KR Market
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                One of the biggest markets in Bengaluru for grains and
                                                pulses.
                                            </p>
                                            <div className="flex items-center text-gray-500 space-x-4">
                                                <span className="flex items-center">
                                                    <FaLocationDot className="mr-2 text-green-600" />
                                                    KR Market, Bengaluru
                                                </span>
                                                <span className="flex items-center">
                                                    <FaHandshakeSimple className="mr-2 text-green-600" />
                                                    120+ Vendors
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Partner Card 3 */}
                            <div className="w-80 flex-shrink-0">
                                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <GiShop className="text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">
                                                APMC
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Renowned for fresh vegetables and India's largest onion
                                                market.
                                            </p>
                                            <div className="flex items-center text-gray-500 space-x-4">
                                                <span className="flex items-center">
                                                    <FaLocationDot className="mr-2 text-green-600" />
                                                    Bengaluru, Karnataka
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

                    {/* Desktop Grid - Unchanged */}
                    <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-0">
                        {/* Partner Cards remain exactly the same as in your original code */}
                        {/* Partner Card 1 */}
                        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <GiShop className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">
                                        Yeshwantpur APMC
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Karnataka's largest APMC market, known for quality
                                        vegetables and fruits.
                                    </p>
                                    <div className="flex items-center text-gray-500 space-x-4">
                                        <span className="flex items-center">
                                            <FaLocationDot className="mr-2 text-green-600" />
                                            Yeshwantpur, Bengaluru
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
                        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <GiShop className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">
                                        KR Market
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        One of the biggest markets in Bengaluru for grains and
                                        pulses.
                                    </p>
                                    <div className="flex items-center text-gray-500 space-x-4">
                                        <span className="flex items-center">
                                            <FaLocationDot className="mr-2 text-green-600" />
                                            KR Market, Bengaluru
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
                        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <GiShop className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">
                                        APMC
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Renowned for fresh vegetables and India's largest onion
                                        market.
                                    </p>
                                    <div className="flex items-center text-gray-500 space-x-4">
                                        <span className="flex items-center">
                                            <FaLocationDot className="mr-2 text-green-600" />
                                            Bengaluru, Karnataka
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

                    {/* Benefits Section */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AiFillSafetyCertificate className="text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">
                                Quality Assured
                            </h4>
                            <p className="text-gray-600">
                                All products undergo strict quality checks at APMC markets
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTruckFast className="text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">
                                Direct Supply
                            </h4>
                            <p className="text-gray-600">
                                Fresh produce directly from APMC markets to your doorstep
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MdOutlineCurrencyRupee className="text-2xl text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">
                                Fair Pricing
                            </h4>
                            <p className="text-gray-600">
                                Transparent pricing based on daily APMC rates
                            </p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mt-4">
                        <a
                            href="#"
                            className="inline-flex items-center bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
                        >
                            <span className="mr-2">View All APMC Products</span>
                            <i className="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default APMCPartners;