'use client';
import React, { useState, useEffect } from "react";
import { FaShoppingBasket, FaAward, FaLeaf } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { LuMousePointer2 } from "react-icons/lu";

// Updated Carousel Component to be responsive
const Carousel = () => {
    const images = [
        "https://images.pexels.com/photos/57556/pexels-photo-57556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="relative w-full h-[250px] lg:h-[400px] rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gray-200">
                <img
                    src={images[currentIndex]}
                    alt={`Carousel Slide ${currentIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-1000 transform hover:scale-105"
                />
            </div>
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white bg-gray-600 rounded-full p-2"
            >
                &#10094;
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white bg-gray-600 rounded-full p-2"
            >
                &#10095;
            </button>
        </div>
    );
};

// HeroSection component
const HeroSection = () => {
    // Function to scroll to the "How It Works" section
    // Function to scroll to the "How It Works" section with an offset
    // Function to scroll to the "How It Works" section with an offset
    // Function to scroll to the "How It Works" section with an offset
    const scrollToHowItWorks = () => {
        const element = document.getElementById("howItWorks");
        if (element) {
            const top = element.getBoundingClientRect().top + window.scrollY; // Get the top position of the element
            const offset = 100; // Adjusted the offset to 100px for a smaller scroll
            window.scrollTo({
                top: top - offset, // Scroll position adjusted with the offset
                behavior: "smooth",
            });
        }
    };



    return (
        <section
            id="hero"
            className="pt-4 lg:pt-4 pb-4 lg:pb-4 bg-gradient-to-br from-green-50 to-white overflow-hidden"
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-4 lg:gap-8">
                    {/* Hero Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left px-4">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 lg:mb-4">
                            Way2Foods <br />
                            <span className="text-green-500 text-xl lg:text-2xl">
                                Fresh From Farm
                            </span>
                            <br />
                            <span className="text-green-700 text-xl lg:text-2xl">
                                Direct To Your Door
                            </span>
                        </h1>
                        <p className="text-sm lg:text-sm text-gray-600 mb-4 lg:mb-2 max-w-md mx-auto lg:mx-0">
                            Enjoy the convenience of farm-fresh fruits, vegetables, groceries <br></br> and more
                            delivered straight to your doorstep. Sourced directly from us,
                            APMC markets, and FPO partners, guaranteeing the highest quality
                            and unmatched freshness.
                        </p>
                        <div className="flex flex-row gap-3 justify-center lg:justify-start lg:ml-0 mt-4">
                            <a
                                href="#"
                                className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-800 transition-colors duration-300 flex items-center justify-center"
                            >
                                <FaShoppingBasket className="mr-2" />
                                Shop Now
                            </a>
                            <a
                                href="#"
                                onClick={scrollToHowItWorks} // OnClick handler to scroll
                                className="border-2 border-green-700 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors duration-300 flex items-center justify-center"
                            >
                                <LuMousePointer2 className="mr-2" />
                                How It Works
                            </a>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-6 lg:mt-12 grid grid-cols-3 gap-2 max-w-xs mx-auto lg:max-w-lg lg:mx-0">
                            <div className="flex flex-col items-center">
                                <FaTruckFast className="text-xl lg:text-3xl text-green-700 mb-1" />
                                <span className="text-xs lg:text-sm text-gray-600">
                                    Fast Delivery
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <FaAward className="text-xl lg:text-3xl text-green-700 mb-1" />
                                <span className="text-xs lg:text-sm text-gray-600">
                                    Quality Assured
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <FaLeaf className="text-xl lg:text-3xl text-green-700 mb-1" />
                                <span className="text-xs lg:text-sm text-gray-600">
                                    Farm Fresh
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual Section */}
                    <div className="w-full lg:w-3/4 relative">
                        <div className="bg-green-100 rounded-full w-full lg:w-[500px] h-[250px] lg:h-[500px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>
                        <Carousel />
                    </div>
                </div>
            </div>
        </section>
    );
};


export default HeroSection;
