'use client';
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/userContext";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Address from '../profile/addressAdd';
import { useRouter } from 'next/navigation';
import {
  FaCreditCard,
  FaRegCreditCard,
  FaMobileAlt,
  FaWallet,
  FaChevronRight,
} from "react-icons/fa";

const OrderPage = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editAddressId, setEditAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);

  // Redirect to login if user is not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/common/login');
    }
  }, [router]);

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

  // Calculate order totals
  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = calculateSubtotal();

  // Generate UPI URL with dynamic amount
  const generateUpiUrl = () => {
    const amount = total.toFixed(2);
    return `https://api.qrserver.com/v1/create-qr-code/?size=225x225&data=upi%3A%2F%2Fpay%3Fpa%3D9449004956%40ybl%26pn%3DWay2Foods%26am%3D${amount}%26cu%3DINR`;
  };

  // Handle place order
  const handlePlaceOrder = () => {
    if (!selectedAddress || !selectedPayment) {
      toast.error("Please select address and payment method");
      return;
    }
    setShowOrderConfirmation(true);
  };

  // Order Confirmation Modal
  const OrderConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg p-6 max-w-md w-full animate-slide-up">
        <h3 className="text-lg font-bold mb-4">Order Confirmed! 🎉</h3>
        <div className="space-y-2">
          <p className="text-sm">
            Your order for <strong>₹{total.toFixed(2)}</strong> has been placed successfully.
          </p>
          {selectedPayment === 'upi' && (
            <p className="text-sm text-yellow-600">
              Please complete your payment using the UPI QR code.
            </p>
          )}
          {selectedPayment === 'cod' && (
            <p className="text-sm text-green-600">
              Payment will be collected when your order is delivered.
            </p>
          )}
        </div>
        <button
          onClick={() => setShowOrderConfirmation(false)}
          className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-2 md:p-4 bg-white">
      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
      `}</style>

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && <OrderConfirmationModal />}

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
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold">Select Address</h2>
              <button
                onClick={() => setEditAddressId('new')}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <MdAdd className="mr-1" /> Add Address
              </button>
            </div>
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
              <p className="text-sm text-gray-500">No addresses found. Please add an address.</p>
            )}
          </div>

          {/* Address Form Section */}
          {editAddressId && (
            <div className="mt-4">
              <Address editAddressId={editAddressId} setEditAddressId={setEditAddressId} />
            </div>
          )}

          {/* Payment Section */}
          <div className="mt-4">
            <h2 className="text-sm font-semibold mb-2">Payment Method</h2>
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
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    className="sr-only"
                    onChange={() => setSelectedPayment('upi')}
                    checked={selectedPayment === 'upi'}
                  />
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
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    className="sr-only"
                    onChange={() => setSelectedPayment('cod')}
                    checked={selectedPayment === 'cod'}
                  />
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

              {/* UPI QR Code Display */}
              {selectedPayment === 'upi' && (
                <div className="mt-4 p-4 border-t border-gray-100">
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-medium mb-3">
                      Scan this QR code using any UPI app to pay ₹{total.toFixed(2)}
                    </p>
                    <img
                      src={generateUpiUrl()}
                      alt="UPI QR Code"
                      className="w-48 h-48 object-contain border border-gray-200 rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Note: Refresh the page if you've already made the payment
                    </p>
                  </div>
                </div>
              )}
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
                <p>Delivery Charges</p>
                <p className="text-green-500">FREE</p>
              </div>
              <div className="flex justify-between font-bold border-t pt-4">
                <p>Total</p>
                <p>₹{total.toFixed(2)}</p>
              </div>
              <button
                onClick={handlePlaceOrder}
                
                disabled={!selectedAddress || !selectedPayment}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Place your order
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="underline text-sm">Caution:</p>
            <ul className="text-xs space-y-2 mt-2">
              <li>Go back to the cart page to edit your order</li>
              <li>Please confirm your address before proceeding to payment</li>
              <li>Once payment is confirmed, share payment details to confirm your order</li>
              <li>Contact us at +91 9449004956 for any queries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;