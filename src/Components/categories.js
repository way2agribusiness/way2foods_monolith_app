import React from "react";
import {FaArrowRight } from "react-icons/fa6";

const CategoriesSection = () => (
  <div id="categories" className="py-0 bg-white text-xs pb-5">
    <div className="container mx-auto px-4">
      <div className="text-center mb-2 mt-2">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Shop By Categories</h2>
        <p className="text-gray-600">Explore our wide range of fresh products</p>
      </div>
      
      <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:pb-0 -mx-4 px-4 md:mx-0">
        {[
          {
            bg: "bg-gradient-to-br from-green-400 via-yellow-200 to-green-500",
            hoverBg: "group-hover:bg-green-200",
            textColor: "text-green-700",
            image: "https://cdn.zeptonow.com/production/ik-seo/tr:w-1280,ar-3000-3000,pr-true,f-auto,q-80/cms/product_variant/41dac350-b4a0-434a-9653-2ea45fe9887e/Cauliflower.jpeg",
            title: "Vegetables",
            subtitle: "Fresh & Organic"
          },
          {
            bg: "bg-gradient-to-br from-orange-300 via-red-400 to-green-400",
            hoverBg: "group-hover:bg-red-200",
            textColor: "text-red-700",
            image: "https://cdn.zeptonow.com/production/ik-seo/tr:w-900,ar-900-900,pr-true,f-auto,q-80/inventory/product/7b086967-0f2a-4503-9629-ad616ec9f46a-Photo/Apple-Kinnaur.jpeg",
            title: "Fruits",
            subtitle: "Seasonal & Fresh"
          },
          {
            bg: "bg-gradient-to-br from-green-300 via-yellow-400 to-amber-400",
            hoverBg: "group-hover:bg-indigo-200",
            textColor: "text-indigo-700",
            image: "https://cdn.zeptonow.com/production/ik-seo/tr:w-1000,ar-1000-1000,pr-true,f-auto,q-80/cms/product_variant/345f1cea-c287-4b2d-86fd-467ac09dfac0/Sunpure-Refined-Sunflower-Oil-Pouch.jpeg",
            title: "Groceries",
            subtitle: "Wide range & best price"
          },
          {
            bg: "bg-gradient-to-br from-green-200 via-green-300 to-green-500",
            hoverBg: "group-hover:bg-emerald-200",
            textColor: "text-emerald-700",
            image: "https://cdn.zeptonow.com/production/ik-seo/tr:w-400,ar-400-400,pr-true,f-auto,q-80/inventory/product/86f9f1d7-86ca-4ba5-a599-30590eef4f52-/tmp/20231006-1522371/Deep-Rooted-Curry-Leaves.jpeg",
            title: "Organic",
            subtitle: "100% organic"
          },
          {
            bg: "bg-gradient-to-br from-emerald-300 via-emerald-400 to-lime-400",
            hoverBg: "group-hover:bg-purple-200",
            textColor: "text-purple-700",
            image: "https://res.cloudinary.com/dm71xhdxd/image/upload/v1696576692/Static%20Images/W2F_gnw3ch_jvntof.webp",
            title: "Our products",
            subtitle: "Way2Foods products"
          },
          {
            bg: "bg-gradient-to-br from-sky-300 via-sky-200 to-sky-500",
            hoverBg: "group-hover:bg-yellow-200",
            textColor: "text-yellow-700",
            image: "https://images.pexels.com/photos/95425/pexels-photo-95425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            title: "APMC",
            subtitle: "APMC Products"
          },
          {
            bg: "bg-gradient-to-br from-purple-200 via-pink-300 to-purple-500",
            hoverBg: "group-hover:bg-green-200",
            textColor: "text-green-700",
            image: "https://akm-img-a-in.tosshub.com/lingo/ktak/images/story/202405/663870fc903bb-benefits-of-fpo-05154174-16x9.jpg?size=948:533",
            title: "FPO",
            subtitle: "FPO Products"
          },
          {
            bg: "bg-gradient-to-br from-orange-200 via-orange-300 to-orange-500",
            hoverBg: "group-hover:bg-pink-200",
            textColor: "text-pink-700",
            image: "https://img.freepik.com/free-vector/special-offer-creative-sale-banner-design_1017-16284.jpg",
            title: "Offers",
            subtitle: "Special deals"
          }
        ].map((category, index) => (
          <div key={index} className="group flex-none w-[280px] md:w-auto">
            <div className={`${category.bg} rounded-md p-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full`}>
              <div className="flex flex-col items-center h-full">
                <div className={`w-28 h-28 ${category.hoverBg} rounded-full flex items-center justify-center mb-2`}>
                  <img src={category.image} alt={category.title} className="w-28 h-28 rounded-full object-cover" />
                </div>
                <div className="mt-auto text-center">
                  <h3 className="font-semibold text-gray-800 mb-1">{category.title}</h3>
                  <p className="text-gray-600 mb-3">{category.subtitle}</p>
                  <a href="#" className={`${category.textColor} font-medium flex items-center justify-center`}>
                    Shop Now
                    <FaArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CategoriesSection;