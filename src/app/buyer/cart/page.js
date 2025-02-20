'use client';
import React, { useContext, useState, useEffect, useMemo } from "react";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";

const CartPage = () => {
    const { user, setCartLength } = useContext(UserContext); // Using useContext hook correctly
    const [addtoCartData, setAddtoCartData] = useState([]);
    const [cartItems2, setCartItems2] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const router = useRouter();

    // Retrieve the session data safely inside useEffect
    useEffect(() => {
        let productBySession = sessionStorage.getItem('productItem');
        if (productBySession) {
            productBySession = JSON.parse(productBySession);
        } else {
            productBySession = []; // Fallback to an empty array if no data is available
        }

        const productItems = productBySession.map(item => ({
            id: item.productID?._id, // Unique id from product data
            name: item.productID?.title,
            price: item.productID?.price,
            cuttedPrice: item.productID?.cuttedPrice,
            image: item.productID?.image[0], // Using the first image
            seller: item.productID?.sellerID.role,
            product_length: item.product_length
        }));

        setCartItems2(productItems);
    }, []);

    const fetchCartData = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.log('Token not found!');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/addtoCart`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                console.log('Something went wrong!');
                return;
            }

            const data = await response.json();
            const reversed = data.cart.cartProducts.reverse();
            setAddtoCartData(reversed);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    // Handle state for cart items based on fetched data
    useEffect(() => {
        const product = addtoCartData || [];
        setCartItems(
            product.map(item => ({
                id: item.productID?._id,
                name: item.productID?.title,
                price: item.productID?.price,
                cuttedPrice: item.productID?.cuttedPrice,
                image: item.productID?.image?.[0] || 'default-image-path.jpg',
                seller: item.productID?.sellerID?.role || 'Unknown',
                product_length: item.product_length
            }))
        );
    }, [addtoCartData]);

    const cartData = cartItems2.map(item => ({
        product_length: item.product_length,
        productID: item.id
    }));

    // Quantity handlers
    const handleIncrement = (id) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, product_length: item.product_length + 1 } : item
            )
        );
    };

    const handleDecrement = (id) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, product_length: Math.max(1, item.product_length - 1) } : item
            )
        );
    };

    const handleRemove = async (id) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.log('Token not found!');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/addtoCart`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productID: id })
            });

            if (response.ok) {
                const data = await response.json();
                setCartItems(items => items.filter(item => item.id !== id));
                console.log('Product removed successfully:', data);
            } else {
                const errorData = await response.json();
                console.error('Failed to remove product:', errorData.message);
            }
        } catch (error) {
            console.error('Error while removing product:', error);
        }
    };

    const handleIncrement2 = (id) => {
        setCartItems2(items =>
            items.map(item =>
                item.id === id ? { ...item, product_length: item.product_length + 1 } : item
            )
        );
    };

    const handleDecrement2 = (id) => {
        setCartItems2(items =>
            items.map(item =>
                item.id === id ? { ...item, product_length: Math.max(1, item.product_length - 1) } : item
            )
        );
    };

    const handleRemove2 = (id) => {
        setCartItems2(items => {
            const updatedItems = items.filter(item => item.id !== id);
            sessionStorage.setItem('productItem', JSON.stringify(updatedItems));
            return updatedItems;
        });
    };

    // Memoized calculations
    const { subtotal1, total1, subtotal2, total2 } = useMemo(() => {
        const subtotal1 = cartItems.reduce((sum, item) => sum + (item.price * item.product_length), 0);
        // const tax1 = subtotal1 * 0.1;
        const total1 = subtotal1;
        const subtotal2 = cartItems2.reduce((sum, item) => sum + (item.price * item.product_length), 0);
        // const tax2 = subtotal2 * 0.1;
        const total2 = subtotal2;
        return { subtotal1, total1, subtotal2, total2 };
    }, [cartItems, cartItems2]);

    const cartProductSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.log('Token not found!');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/addtoCart`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cartProducts: cartData })
            });

            if (!response.ok) {
                console.log('Something went wrong!');
            }

            const data = await response.json();
            // alert('Product saved in order page!');
            sessionStorage.removeItem('productItem');
            fetchCartData();

        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = () => {
        if (!user) {
            alert('Please login first!');
            router.push(`/common/login?redirectTo=/buyer/cart`);
        } else {
            cartProductSubmit();
            router.push('/buyer/order');
        }
    };

    useEffect(() => {
        setCartLength('');
    }, [setCartLength]);

    return (
        <div className="text-xs max-w-6xl mx-auto p-4 bg-white rounded-md my-5">
            <div className="mb-6">
                <h1 className="text-sm font-semibold ">My Cart</h1>
                <p className="text-gray-500">Complete your purchase</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    {cartItems2.length > 0 ? (
                        cartItems2.map((item, index) => (
                            <div key={index + 1} className="grid grid-cols-12 gap-4 p-7 md:p-4 border rounded-sm items-center">
                                <div className="col-span-2">
                                    <img src={item.image} alt={item.name} className="w-20 h-16 md:h-20 object-cover rounded-sm" />
                                </div>
                                <div className="col-span-5">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <div className="flex gap-2 items-center mt-1">
                                        <span className="text-green-600">₹{item.price}</span>
                                        <span className="text-gray-400 line-through text-sm">₹{item.cuttedPrice}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Sold by: {item.seller}</p>
                                </div>
                                <div className="col-span-3 flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-1 md:gap-3 bg-gray-100 rounded-sm md:px-3 py-2">
                                        <button className="text-gray-600 hover:bg-gray-200 rounded p-1" onClick={() => handleDecrement2(item.id)}>
                                            <FiMinus size={14} />
                                        </button>
                                        <span className="w-6 text-center">{item.product_length}</span>
                                        <button className="text-gray-600 hover:bg-gray-200 rounded p-1" onClick={() => handleIncrement2(item.id)}>
                                            <FiPlus size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="col-span-1 text-right font-medium">₹{(item.price * item.product_length).toFixed(2)}</div>
                                <div className="col-span-1 text-right">
                                    <button className="text-red-500 hover:text-red-700 p-5 transition-colors" onClick={() => handleRemove2(item.id)}>
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (user && <div className="col-span-12 text-center text-xl font-semibold text-gray-500">No cart products</div>)}

                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <div key={index + 1} className="grid grid-cols-12 gap-4 p-7 md:p-4 border rounded-sm items-center">
                                <div className="col-span-2">
                                    <img src={item.image} alt={item.name} className="w-20 h-16 md:h-20 object-cover rounded-sm" />
                                </div>
                                <div className="col-span-5">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <div className="flex gap-2 items-center mt-1">
                                        <span className="text-green-600">₹{item.price}</span>
                                        <span className="text-gray-400 line-through text-sm">₹{item.cuttedPrice}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Sold by: {item.seller}</p>
                                </div>
                                <div className="col-span-3 flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-1 md:gap-3 bg-gray-100 rounded-sm md:px-3 py-2">
                                        <button className="text-gray-600 hover:bg-gray-200 rounded p-1" onClick={() => handleDecrement(item.id)}>
                                            <FiMinus size={14} />
                                        </button>
                                        <span className="w-6 text-center">{item.product_length}</span>
                                        <button className="text-gray-600 hover:bg-gray-200 rounded p-1" onClick={() => handleIncrement(item.id)}>
                                            <FiPlus size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="col-span-1 text-right font-medium">₹{(item.price * item.product_length).toFixed(2)}</div>
                                <div className="col-span-1 text-right">
                                    <button className="text-red-500 hover:text-red-700 p-5 transition-colors" onClick={() => handleRemove(item.id)}>
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (user && <div className="col-span-12 text-center text-xl font-semibold text-gray-500">No cart products</div>)}
                </div>

                {(cartItems.length > 0 || cartItems2.length > 0) && (
                    <div className="text-xs md:w-96 bg-gray-50 p-6 rounded-sm h-fit sticky top-6">
                        <h2 className="text-sm font-bold mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>₹{(subtotal1 + subtotal2).toFixed(2)}</span>
                            </div>
                            {/* <div className="flex justify-between">
                                <span>Tax (10%):</span>
                                <span>₹{(tax1 + tax2).toFixed(2)}</span>
                            </div> */}
                            <div className="flex justify-between">
                                <span>Delivery:</span>
                                <span className="text-green-500">FREE</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>₹{(total1 + total2).toFixed(2)}</span>
                            </div>
                            <button className="hidden md:block w-full bg-green-500 text-white py-3 rounded-sm mt-4 hover:bg-green-600 transition-colors" onClick={handleSubmit}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {(cartItems.length > 0 || cartItems2.length > 0) && (
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t p-4 shadow-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold">₹{(total1 + total2).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">Incl. all taxes</p>
                        </div>
                        <button className="bg-green-500 text-white px-6 py-2 rounded-sm hover:bg-green-600 transition-colors" onClick={handleSubmit}>
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
