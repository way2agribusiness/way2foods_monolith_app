'use client';
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "@/context/userContext";
import { FiShare2 } from "react-icons/fi";
import { BsCart4 } from "react-icons/bs";
import CategoryWiseProduct from "@/Components/categoriesWise";
import RoleWiseProduct from "@/Components/roleWise";
import HowItWorks from "@/Components/workStep";
import APMCPartners from "@/Components/apmcWorkstep";
import FPOpartner from "@/Components/fpoWorkstep";

const CollectionDetails = ({ params }) => {
    const { user, setCartLength } = useContext(UserContext); // Changed to setCartLength
    const [slug, setSlug] = useState('');
    const [product, setProduct] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [productID, setProductID] = useState('');
    const [isApproved, setIsApproved] = useState('');
    const [category, setCategory] = useState('');
    const [rolename, setRoleName] = useState('');
    const [categoryProducts, setCategoryProducts] = useState([]);

    const [isOpenNum, setIsOpenNum] = useState('');
    const [incrementNumber, setIncrementNumber] = useState(1);

    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            setSlug(resolvedParams.slug);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        const fetchProductBySlug = async (slugData) => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product?slug=${slugData}`);
                if (!response.ok) return;

                const data = await response.json();
                setProduct(data.product);
                setProductID(data.product._id);
                setIsApproved(data.product.isApproved);
                setCategory(data.product.categoryID.name);
                setRoleName(data.product.rolename);

                // Fetch related products by category
                fetchRelatedProducts(data.product.categoryID.name);
            } catch (error) {
                console.log(error);
            }
        };
        fetchProductBySlug(slug);
    }, [slug]);

    const fetchRelatedProducts = async (categoryName) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?category=${categoryName}`);
            if (response.ok) {
                const data = await response.json();
                setCategoryProducts(data.products);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Add to Cart Logic
    const addtoCart = (productId, productItem) => {
        setIncrementNumber(1);
        setIsOpenNum(productId);

        let cartProducts = getSessionCart();
        const existingProductIndex = cartProducts.findIndex(product => product.productID._id === productItem._id);

        if (existingProductIndex !== -1) {
            cartProducts[existingProductIndex].product_length = 1;
        } else {
            cartProducts.push({
                product_length: 1,
                productID: productItem
            });
        }

        sessionStorage.setItem('productItem', JSON.stringify(cartProducts));
        setCartLength(cartProducts.length);
    };

    const getSessionCart = () => {
        const cartData = sessionStorage.getItem('productItem');
        try {
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error("Error parsing cart data:", error);
            return [];
        }
    };

    const increment = (productId) => {
        if (incrementNumber < 5) {
            setIncrementNumber(prev => {
                const newNumber = prev + 1;
                updateCartProductLength(newNumber, productId);
                return newNumber;
            });
        }
    };

    const decrement = (productId) => {
        if (incrementNumber === 1) {
            setIsOpenNum('');
            removeProductFromCart(productId);
        } else if (incrementNumber > 1) {
            setIncrementNumber(prev => {
                const newNumber = prev - 1;
                updateCartProductLength(newNumber, productId);
                return newNumber;
            });
        }
    };

    const removeProductFromCart = (productId) => {
        let cartProducts = getSessionCart();
        const updatedCart = cartProducts.filter(product => product.productID._id !== productId);
        sessionStorage.setItem('productItem', JSON.stringify(updatedCart));
        setCartLength(updatedCart.length);
    };

    const updateCartProductLength = (newLength, productId) => {
        let cartProducts = getSessionCart();
        const productIndex = cartProducts.findIndex(product => product.productID._id === productId);

        if (productIndex !== -1) {
            cartProducts[productIndex].product_length = newLength;
            sessionStorage.setItem('productItem', JSON.stringify(cartProducts));
            setCartLength(cartProducts.length);
        }
    };

    const toggleApproval = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/approval`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: productID,
                    isApproved: !isApproved,
                })
            });

            if (response.ok) {
                const data = await response.json();
                setIsApproved(data.product.isApproved);
                setProduct(data.product);
            }
        } catch (error) {
            console.error("Error toggling approval status:", error);
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <>
            <div className="min-h-screen bg-white text-xs">
                <div className="flex flex-col lg:flex-row max-w-6xl mx-auto">
                    {/* Image Gallery Section */}
                    <div className="w-full lg:w-1/2 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
                        <div className="flex gap-2 p-2">
                            <div className="flex flex-col gap-4">
                                {product.image.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-12 h-12 rounded overflow-hidden border transition-all ${selectedImage === index ? "border-green-500" : "border-gray-200"
                                            }`}
                                    >
                                        <img src={img} alt={product.title} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1">
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={product.image[selectedImage]}
                                        alt={product.title}
                                        className="w-full h-[90%] object-cover border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="w-full lg:w-1/2 bg-white">
                        <div className="p-4">
                            <div className="border-b pb-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h2 className="text-sm font-semibold text-gray-800">{product.title}</h2>
                                        <p className="text-gray-500 mt-1">Net Qty: {product.quantity}</p>
                                    </div>
                                    <div className="flex gap-10">
                                        <button className="p-1 hover:bg-green-100 rounded-full">
                                            <FiShare2 className="w-4 h-4 text-gray-600" />
                                        </button>
                                        {user?.role === 'admin' && (
                                            <button
                                                onClick={toggleApproval}
                                                className={`${product.isApproved
                                                    ? 'bg-green-500 hover:bg-green-600'
                                                    : 'bg-red-500 hover:bg-red-600'
                                                    } text-white p-1 rounded`}
                                            >
                                                {product.isApproved ? 'Click to Unapprove' : 'Click to Approve'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                                    <span className="text-green-600 font-semibold text-xs">
                                        {((product.cuttedPrice - product.price) / product.cuttedPrice * 100).toFixed(0)}% Off
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">₹{product.cuttedPrice}</span>
                                </div>
                            </div>

                            <div className="py-3 border-b">
                                <h3 className="text-sm font-semibold text-gray-800">Seller Details:</h3>
                                <br />
                                <h3 className="mb-4">{product.brand.name}</h3>
                                <h2 className="mb-4">Yeshwantpura, Bengaluru</h2>
                            </div>

                            <div className="py-3 border-b">
                                <h3 className="text-sm font-semibold mb-4 text-gray-800">Highlights</h3>
                                <div className="space-y-4">
                                    {product.specifications.map((item, index) => (
                                        <div key={index} className="flex flex-col lg:flex-row gap-2">
                                            <span className="text-gray-600 lg:w-32 font-medium">{item.title}</span>
                                            <span className="flex-1 text-blue-600 text-xs">{item.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Add to Cart Section */}
                            <div className="pt-3">
                                {isOpenNum === product._id ? (
                                    <div className="mt-3 flex justify-center items-center gap-4 border border-red-600 rounded-md">
                                        <button
                                            className="px-4 py-2 text-sm text-red-600"
                                            onClick={() => decrement(product._id)}
                                        >
                                            -
                                        </button>
                                        <span className="text-xs text-red-600">{incrementNumber}</span>
                                        <button
                                            className="px-4 py-2 text-sm text-red-600"
                                            onClick={() => increment(product._id)}
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="mt-3 bg-green-700 text-white px-4 py-2 rounded-md w-full hover:bg-green-800 transition-colors text-sm flex items-center justify-center gap-2"
                                        onClick={() => addtoCart(product._id, product)}
                                    >
                                        <BsCart4 size={20} />
                                        <span>Add to Cart</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Sections */}
            <div className="my-5">
                {category && <CategoryWiseProduct categoryName={category} />}
                {category && categoryProducts.map((productItem) => (
                    <div key={productItem._id} className="p-4">
                        <h3 className="text-sm font-semibold text-gray-800">{productItem.title}</h3>
                        <p className="text-gray-500">{productItem.quantity}</p>

                        {isOpenNum === productItem._id ? (
                            <div className="mt-3 flex justify-center items-center gap-4 border border-red-600 rounded-md">
                                <button
                                    className="px-4 py-2 text-sm text-red-600"
                                    onClick={() => decrement(productItem._id)}
                                >
                                    -
                                </button>
                                <span className="text-xs text-red-600">{incrementNumber}</span>
                                <button
                                    className="px-4 py-2 text-sm text-red-600"
                                    onClick={() => increment(productItem._id)}
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <button
                                className="mt-3 bg-green-700 text-white px-4 py-2 rounded-md w-full hover:bg-green-800 transition-colors text-sm flex items-center justify-center gap-2"
                                onClick={() => addtoCart(productItem._id, productItem)}
                            >
                                <BsCart4 size={20} />
                                <span>Add to Cart</span>
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="my-5">
                {rolename && <RoleWiseProduct roleName={rolename} />}
            </div>
            <div className="my-5">
                {rolename === 'admin' ? <HowItWorks />
                    : rolename === 'apmcConnect' ? <APMCPartners />
                        : <FPOpartner />}
            </div>
        </>
    );
};

export default CollectionDetails;
