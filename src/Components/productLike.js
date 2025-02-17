'use client';
import { useRouter } from "next/navigation";
import React, { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "@/context/userContext";
import { BsCart4 } from "react-icons/bs";

const ProductsLike = () => {
    const { setCartLength } = useContext(UserContext); // Using useContext hook correctly
    const [productsData, setProductData] = useState([]);
    const scrollContainerRef = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const [isOpenNum, setIsOpenNum] = useState('');
    const [incrementNumber, setIncrementNumber] = useState(1); // Initialize as a number


    const router = useRouter();

    const fetchProductsLike = async () => {
        try {
            // Clear the session storage before fetching new data
            sessionStorage.removeItem('productsLikeData');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/productslike`);

            if (!response.ok) {
                console.log('Something went wrong!');
            }

            const data = await response.json();
            // console.log('data-productLikes :', data);
            // Save the fetched data to sessionStorage to persist it across navigation
            sessionStorage.setItem('productsLikeData', JSON.stringify(data));
            setProductData(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // Check if data exists in sessionStorage
        const cachedData = sessionStorage.getItem('productsLikeData');

        if (cachedData) {
            // If data exists in sessionStorage, use it
            setProductData(JSON.parse(cachedData));
        } else {
            // If no cached data, fetch new data
            fetchProductsLike();
        }
    }, []);


    // Mouse down event to start dragging
    const handleMouseDown = (e) => {
        setIsScrolling(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = 'grabbing';
    };

    // Mouse up event to stop dragging
    const handleMouseUp = () => {
        setIsScrolling(false);
        scrollContainerRef.current.style.cursor = 'grab';
    };

    // Mouse leave event to stop dragging when mouse leaves the container
    const handleMouseLeave = () => {
        setIsScrolling(false);
        scrollContainerRef.current.style.cursor = 'grab';
    };

    // Mouse move event to scroll the container when dragging
    const handleMouseMove = (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;  // Adjust speed of scroll
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const detailsPage = (slug) => {
        router.push(`/buyer/collection/${slug}`);
    };


    const addtoCart = (productId, productItem) => {
        // Reset the increment number to 1 when a new product is clicked
        setIncrementNumber(1);

        // Show the increment/decrement buttons when item is added to cart
        setIsOpenNum(productId);

        // Retrieve existing cart products from sessionStorage and safely parse
        let cartProducts = getSessionCart();

        // Check if the product already exists in the cart
        const existingProductIndex = cartProducts.findIndex(product => product.productID._id === productItem._id);

        if (existingProductIndex !== -1) {
            // If the product already exists, update its length
            cartProducts[existingProductIndex].product_length = 1;
        } else {
            // If the product doesn't exist, add a new product with the current quantity
            cartProducts.push({
                product_length: 1,
                productID: productItem
            });
        }

        // Save the updated cart products to sessionStorage
        sessionStorage.setItem('productItem', JSON.stringify(cartProducts));

        // Update cart length in context
        setCartLength(cartProducts.length); // Update the cart length in the context
    };

    // Utility function to safely get and parse sessionStorage data
    const getSessionCart = () => {
        const cartData = sessionStorage.getItem('productItem');
        try {
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error("Error parsing cart data:", error);
            return []; // Return an empty array if parsing fails
        }
    };

    // This useEffect will safely update the cart data whenever the incrementNumber changes
    const increment = (productId) => {
        if (incrementNumber < 5) {  // Limit the increment to 5
            setIncrementNumber(prev => {
                const newNumber = prev + 1;
                // Update the cart product length in sessionStorage by productId
                updateCartProductLength(newNumber, productId);
                return newNumber;
            });
        }
    };

    const decrement = (productId) => {
        if (incrementNumber === 1) {  // When the number is 1 and decrement is clicked
            // Instead of immediately setting cartLength to 0, we will remove the product if quantity is 0
            setIsOpenNum('');  // Hide the increment/decrement buttons
            removeProductFromCart(productId);  // Remove product from cart
        } else if (incrementNumber > 1) {  // If greater than 1, simply decrement
            setIncrementNumber(prev => {
                const newNumber = prev - 1;
                // Update the cart product length in sessionStorage by productId
                updateCartProductLength(newNumber, productId);
                return newNumber;
            });
        }
    };

    // Function to remove product from cart when quantity reaches 0
    const removeProductFromCart = (productId) => {
        let cartProducts = getSessionCart();

        // Filter out the product that matches the productId
        const updatedCart = cartProducts.filter(product => product.productID._id !== productId);

        // Save the updated cart to sessionStorage
        sessionStorage.setItem('productItem', JSON.stringify(updatedCart));

        // Update the cart length in context (if there are no products, length will be 0)
        setCartLength(updatedCart.length);
    };

    // Update cart product length if the quantity changes
    const updateCartProductLength = (newLength, productId) => {
        let cartProducts = getSessionCart();

        if (cartProducts.length > 0) {
            // Find the product by its ID and update the product_length
            const productIndex = cartProducts.findIndex(product => product.productID._id === productId);

            if (productIndex !== -1) {
                // Update the length of the specific product
                cartProducts[productIndex].product_length = newLength;
                // Save the updated cart product back to sessionStorage
                sessionStorage.setItem('productItem', JSON.stringify(cartProducts));
                // Update cart length in context
                setCartLength(cartProducts.length); // Update the cart length in the context
            }
        }
    };


    return (
        <>
            <div className="bg-gradient-to-br from-blue-300 via-purple-400 to-green-400 p-4">
                <h4 className="text-xl font-semibold mb-4">Products You May Like</h4>
                {/* Adding the drag-to-scroll container */}
                <div
                    ref={scrollContainerRef}
                    className="my-2 flex overflow-x-auto gap-4 py-2 scroll-smooth cursor-grab no-scrollbar"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {productsData.product && productsData.product.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg">
                            <div className="w-48 p-1 flex-shrink-0 select-none"
                                onClick={detailsPage.bind(this, item.slug)}
                            >
                                <div className="relative">
                                    <img
                                        className="w-full h-32 object-cover rounded-t-lg mb-3"
                                        src={item.image[0]}
                                        alt={item.title}
                                        draggable="false"
                                    />
                                    <span
                                        className={`absolute top-0 left-0 text-white text-xs`}
                                    >
                                        {
                                            item.sellerID.role === 'apmcConnect' ? (<p
                                                className="py-1 px-2 rounded-full"
                                                style={{ backgroundColor: '#60a5fa' }}>APMC</p>)
                                                :
                                                item.sellerID.role === 'fpoConnect' ? (<p
                                                    className="py-1 px-2 rounded-full"
                                                    style={{ backgroundColor: '#c084fc' }}>FPO</p>)
                                                    : (<p
                                                        className="py-1 px-2 rounded-full"
                                                        style={{ backgroundColor: '#34d399' }}>W2F</p>)
                                        }
                                    </span>
                                </div>

                                <h3 className="text-base font-semibold text-gray-800 mb-2 truncate pl-4">{item.title}</h3>
                                <div className="flex justify-between items-center text-gray-800">
                                    <span className="line-through text-xs text-gray-500">
                                        ₹{item.cuttedPrice}
                                    </span>
                                    <span className="font-semibold text-base">₹{item.price}</span>
                                </div>

                                <p className={`text-sm font-medium mt-1 ${parseInt(item.quantity) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {parseInt(item.quantity) > 0 ? 'Available' : 'Not-Available'}
                                </p>
                            </div>
                            <div className="p-1">
                                {isOpenNum === item._id ? (
                                    <div className="mt-3 flex justify-center items-center gap-4 border border-red-600 rounded-lg">
                                        <button
                                            className="px-4 py-2 text-sm text-red-600"
                                            onClick={() => decrement(item._id)}
                                        >
                                            -
                                        </button>
                                        <span className="text-xs text-red-600">{incrementNumber}</span>
                                        <button
                                            className="px-4 py-2 text-sm text-red-600"
                                            onClick={() => increment(item._id)}
                                        >
                                            +
                                        </button>
                                    </div>

                                ) : (
                                    <button
                                        className="mt-3 bg-green-700 text-white px-4 py-2 rounded-lg w-full hover:bg-green-800 transition-colors text-sm flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        onClick={addtoCart.bind(this, item._id, item)}
                                    >
                                        <BsCart4 size={20} />
                                        <span>Add to Cart</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end text-xs">
                    <h4 className="text-blue-600 hover:underline cursor-pointer">View ALL</h4>
                </div>
            </div>
        </>
    );
};

export default ProductsLike; 
