import React from "react";
import { FaLeaf, FaSearch, FaShoppingCart, FaCreditCard, FaTruck, FaRegClock, FaHeadset, FaArrowRight } from "react-icons/fa";

const HowItWorks = () => {
  return (
    <section id="howItWorks" className="py-2 bg-white">
      <div className="container mx-auto px-4 max-w-6xl text-xs">
        {/* Section Header */}
        <div className="text-center mb-2">
          <h2 className="font-bold text-gray-800 mb-1 text-xl">
            How Way2Foods Works
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Experience seamless farm-to-table shopping with our easy 4-step
            process
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Lines (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-green-100 -translate-y-1/2">
            <div className="absolute left-1/4 right-1/4 h-full bg-green-500"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 relative z-10">
                <FaSearch size={20} className="text-green-600" />
              </div>
              <h2>Step 1</h2>
              <br />
              <h3 className="font-semibold text-gray-800">
                Browse Products
              </h3>
              <p className="text-center text-gray-600">
                Explore our wide range of fresh products from Way2Foods, APMC
                and FPO
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 relative z-10">
                <FaShoppingCart size={20} className="text-green-600" />
              </div>
              <h2>Step 2</h2>
              <br />
              <h3 className="font-semibold text-gray-800 mb-2">
                Add to Cart
              </h3>
              <p className="text-center text-gray-600">
                Select your items and add them to your shopping cart with one
                click
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 relative z-10">
                <FaCreditCard size={20} className="text-green-600" />
              </div>
              <h2>Step 3</h2>
              <br />
              <h3 className="font-semibold text-gray-800 mb-2">
                Secure Checkout
              </h3>
              <p className="text-center text-gray-600">
                Complete your purchase with our safe and secure payment options
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 relative z-10">
                <FaTruck size={20} className="text-green-600" />
              </div>
              <h2>Step 4</h2>
              <br />
              <h3 className="font-semibold text-gray-800 mb-2">
                Fast Delivery
              </h3>
              <p className="text-center text-gray-600">
                Get fresh products delivered to your doorstep as soon as
                possible.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {/* Feature 1 */}
          <div className="bg-green-50 rounded-xl p-4 md:p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaRegClock size={20} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  Fast Delivery
                </h4>
                <p className="text-gray-600">
                  Order before 2 PM for fast delivery
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-green-50 rounded-xl p-4 md:p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaLeaf size={20} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  Quality Products
                </h4>
                <p className="text-gray-600">
                  Quality products direct from the farm
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-green-50 rounded-xl p-4 md:p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaHeadset size={20} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  24/7 Support
                </h4>
                <p className="text-gray-600">Always here to help you</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-4">
          <a
            href="#"
            className="inline-flex items-center bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
          >
            <span className="mr-2">Start Shopping Now</span>
            <FaArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
