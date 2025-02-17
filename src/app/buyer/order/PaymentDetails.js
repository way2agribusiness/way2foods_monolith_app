import React from "react";
import {
    FaCreditCard,
    FaRegCreditCard,
    FaMobileAlt,
    FaWallet,
    FaChevronRight,
    FaInfoCircle,
} from "react-icons/fa";

const PaymentSection = () => {
    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg p-4 mt-2 shadow-sm">
            <h2 className="text-sm font-semibold mb-4 text-gray-700">
                Select Payment Method
            </h2>

            {/* Payment Options Grid */}
            <div className="space-y-3">
                {/* Disabled Credit Card Option */}
                <div className="relative opacity-50 cursor-not-allowed">
                    <div className="flex items-center p-3 rounded-md border border-gray-100 bg-gray-50">
                        <div className="flex items-center space-x-3 w-full">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaCreditCard className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-xs text-gray-700 line-through">
                                Credit Card
                            </span>
                        </div>
                        <span className="text-xs text-red-500 ml-auto px-2 py-1 bg-red-50 rounded">
                            Unavailable
                        </span>
                    </div>
                </div>

                {/* Disabled Debit Card Option */}
                <div className="relative opacity-50 cursor-not-allowed">
                    <div className="flex items-center p-3 rounded-md border border-gray-100 bg-gray-50">
                        <div className="flex items-center space-x-3 w-full">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                <FaRegCreditCard className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="font-medium text-xs text-gray-700 line-through">
                                Debit Card
                            </span>
                        </div>
                        <span className="text-xs text-red-500 ml-auto px-2 py-1 bg-red-50 rounded">
                            Unavailable
                        </span>
                    </div>
                </div>

                {/* Active UPI Option */}
                <label className="group flex items-center p-3 rounded-md border border-green-100 bg-white hover:border-green-200 transition-colors cursor-pointer">
                    <input type="radio" name="payment" value="upi" className="sr-only" />
                    <div className="flex items-center space-x-3 w-full">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <FaMobileAlt className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <span className="font-medium text-xs text-gray-700">UPI</span>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Instant payment using any UPI app
                            </p>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center space-x-2">
                        <FaChevronRight className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </label>

                {/* Active Cash on Delivery Option */}
                <label className="group flex items-center p-3 rounded-md border border-orange-100 bg-white hover:border-orange-200 transition-colors cursor-pointer">
                    <input type="radio" name="payment" value="cod" className="sr-only" />
                    <div className="flex items-center space-x-3 w-full">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                            <FaWallet className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                            <span className="font-medium text-xs text-gray-700">
                                Cash on Delivery
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Pay in cash when your order is delivered
                            </p>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center space-x-2">
                        <FaChevronRight className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </label>
            </div>

            {/* Service Notice */}
            <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-100">
                <div className="flex items-start space-x-2">
                    <FaInfoCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-medium text-amber-700">
                            Temporary Service Notice
                        </p>
                        <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                            Our payment gateway is experiencing high traffic. To ensure
                            successful transactions, we've temporarily enabled only UPI and
                            Cash on Delivery. Other methods will be restored shortly. We
                            appreciate your understanding.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSection;