'use client';
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/userContext";
import { MdEdit, MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Address from '../profile/addressAdd'
import {
  FaCreditCard,
  FaRegCreditCard,
  FaMobileAlt,
  FaWallet,
  FaChevronRight,
} from "react-icons/fa";

const OrderPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editAddressId, setEditAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart data from API or sessionStorage
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        let items = [];

        if (user) {
          // Fetch from API for authenticated users
          const token = localStorage.getItem("token");
          if (!token) return;

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/addtoCart`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.ok) {
            const data = await response.json();
            items = data.cart?.cartProducts?.map(item => ({
              id: item.productID?._id,
              name: item.productID?.title,
              price: item.productID?.price,
              quantity: item.product_length,
              image: item.productID?.image?.[0] || "",
            })) || [];
          }
        } else {
          // Fetch from sessionStorage for guests
          const sessionItems = JSON.parse(
            sessionStorage.getItem("productItem") || "[]"
          );
          items = sessionItems.map(item => ({
            id: item.productID?._id,
            name: item.productID?.title,
            price: item.productID?.price,
            quantity: item.product_length,
            image: item.productID?.image?.[0] || "",
          }));
        }

        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, [user]);

  // Address deletion handler
  const handleDeleteAddress = async (addressId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/address`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ addressId }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        toast.success("Address deleted successfully");
        if (selectedAddress === addressId) setSelectedAddress(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete address");
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate order totals
  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = calculateSubtotal() * 0.1;
  const total = calculateSubtotal() + tax;

  return (
    <div className="max-w-6xl mx-auto p-2 md:p-4 bg-white">
      {/* Header Section */}
      <div className="mb-2">
        <h1 className="text-sm md:text-sm font-bold text-gray-800">Complete your order</h1>
        <p className="text-xs text-gray-500">
          Review the products, address, and payment details to place your order.
        </p>
      </div>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
        {/* Left Column */}
        <div className="w-full md:w-2/3">
          {/* Product List Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold mb-0">Items in your cart</h2>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-100 py-4 space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">₹{item.price?.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs">Qty: {item.quantity}</span>
                    <p className="text-sm font-semibold">₹{(item.price * item.quantity)?.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4">Your cart is empty</p>
            )}
          </div>

          {/* Address Section */}
          <div className="mt-1">
            <h2 className="text-sm font-semibold mb-2">Select Address</h2>
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading addresses...</p>
            ) : user?.addressID?.length > 0 ? (
              <div className="space-y-4">
                {user.addressID.map((address) => (
                  <div key={address._id} className="bg-white rounded-lg p-4 border border-gray-200 relative">
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <input
                        type="radio"
                        name="address"
                        className="w-5 h-5 cursor-pointer"
                        checked={selectedAddress === address._id}
                        onChange={() => setSelectedAddress(address._id)}
                      />
                      <div className="flex space-x-3">
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={() => setEditAddressId(address._id)}
                        >
                          <MdEdit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteAddress(address._id)}
                        >
                          <MdDelete className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 text-xs font-medium">{address.address_line1}</p>
                    {address.address_line2 && (
                      <p className="text-gray-700 text-xs">{address.address_line2}</p>
                    )}
                    <p className="text-gray-700 text-xs">{address.city}, {address.district}</p>
                    <p className="text-gray-700 text-xs">{address.state}, {address.country} ({address.Zip_Code})</p>
                    <p className="text-gray-700 text-xs">
                      <span className="text-blue-600">{address.phone}</span>
                      {address.alternative_phone && (
                        <span className="text-blue-600 ml-2">{address.alternative_phone}</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            ) : (

              <p className="text-sm text-gray-500">No addresses found. Please add an address.{<Address />}</p>
            )}
          </div>

          {/* Payment Section */}
          <div className="mt-1">
            <h2 className="text-sm font-semibold mb-1">Payment Method</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                {/* Payment Options */}
                <div className="relative opacity-50 cursor-not-allowed">
                  <div className="flex items-center p-3 rounded-md border border-gray-100 bg-gray-50">
                    <div className="flex items-center space-x-3 w-full">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaCreditCard className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-sm text-gray-700 line-through">Credit Card</span>
                    </div>
                    <span className="text-xs text-red-500 ml-auto px-2 py-1 bg-red-50 rounded">Unavailable</span>
                  </div>
                </div>
                <div className="relative opacity-50 cursor-not-allowed">
                  <div className="flex items-center p-3 rounded-md border border-gray-100 bg-gray-50">
                    <div className="flex items-center space-x-3 w-full">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <FaRegCreditCard className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium text-sm text-gray-700 line-through">Debit Card</span>
                    </div>
                    <span className="text-xs text-red-500 ml-auto px-2 py-1 bg-red-50 rounded">Unavailable</span>
                  </div>
                </div>
                <label className="group flex items-center p-3 rounded-md border border-green-100 bg-white hover:border-green-200 transition-colors cursor-pointer">
                  <input type="radio" name="payment" value="upi" className="sr-only" />
                  <div className="flex items-center space-x-3 w-full">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <FaMobileAlt className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium text-sm text-gray-700">UPI</span>
                      <p className="text-xs text-gray-500 mt-0.5">Instant payment using any UPI app</p>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <FaChevronRight className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </label>
                <label className="group flex items-center p-3 rounded-md border border-orange-100 bg-white hover:border-orange-200 transition-colors cursor-pointer">
                  <input type="radio" name="payment" value="cod" className="sr-only" />
                  <div className="flex items-center space-x-3 w-full">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaWallet className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <span className="font-medium text-sm text-gray-700">Cash on Delivery</span>
                      <p className="text-xs text-gray-500 mt-0.5">Pay in cash when your order is delivered</p>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <FaChevronRight className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Order Summary) */}
        <div className="w-full md:w-1/3">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
            <h2 className="text-md font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>₹{calculateSubtotal().toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Tax (10%)</p>
                <p>₹{tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Delivery Charges</p>
                <p className="text-green-500">FREE</p>
              </div>
              <div className="flex justify-between font-bold border-t pt-4">
                <p>Total</p>
                <p>₹{total.toFixed(2)}</p>
              </div>
              <button
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
                disabled={!selectedAddress}
              >
                Place your order
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="underline text-sm">Caution:</p>
            <ul className="text-xs space-y-2 mt-2">
              <li>Please confirm your address before proceeding to payment</li>
              <li>Once payment is confirmed, share payment details to confirm your order</li>
              <li>Contact us at +91 9449004956 for any queries</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg md:hidden">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Total Payable</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  ₹{total.toFixed(2)}
                </span>
                <span className="text-xs text-green-600">(Incl. all taxes)</span>
              </div>
            </div>
            <button
              className="flex-shrink-0 bg-green-500 hover:bg-green-600 transition-all px-8 py-4 rounded-xl shadow-md hover:shadow-lg focus:ring-2 ring-green-200 ring-offset-2"
              disabled={!selectedAddress}
            >
              <span className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wide">
                Place Order
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;