'use client';
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "@/context/userContext";
import { toast, ToastContainer } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles
import { useRouter } from "next/navigation";

// Example JSON data for categories and subcategories
const categoryData = {
  '678a27fa78c25ec261070be8': {
    name: "Vegetables",
    subcategories: [
      { id: '678a27fa78c25ec261070beb', name: "Essential and Regular Vegetables" },
      { id: '678a282678c25ec261070c03', name: "Exotic Vegetables" },
      { id: '678a285978c25ec261070c1b', name: "Leafy Vegetables" },
      { id: '678a288478c25ec261070c31', name: "Major Vegetables" },
      { id: '678a28a378c25ec261070c47', name: "Other Vegetables" },
    ],
  },
  '678a28d678c25ec261070c5c': {
    name: "Fruits",
    subcategories: [
      { id: '678a28d678c25ec261070c5f', name: "Exotic and Imported Fruits" },
      { id: '678a28f978c25ec261070c75', name: "Major Seasonal Fruits" },
      { id: '678a292478c25ec261070c8b', name: "Other Fruits" },
    ],
  },
  '678a295f78c25ec261070ca0': {
    name: "Groceries",
    subcategories: [
      { id: '678a295f78c25ec261070ca3', name: "Grains, Pulses, and Millets" },
      { id: '678a299378c25ec261070cb9', name: "Oil, Seeds, and Other" },
      { id: '678a29cf78c25ec261070ccf', name: "Plantation and Nuts" },
      { id: '678a2a0a78c25ec261070ce5', name: "Spices" },
      { id: '678a2a3978c25ec261070cfb', name: "Special Packages" },
      { id: '678a2a7d78c25ec261070d11', name: "Special Products" },
    ],
  },
};

const AddCollectionsServices = () => {
  const { user } = useContext(UserContext); // Using useContext hook correctly
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    category: "",
    subCategory: "",
    price: "",
    cuttedPrice: "",
    quantityAvailable: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [productId, setProductId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({}); // Error handling state
  const [categoryID, setCategoryID] = useState('');
  const [subcategoryID, setSubCategoryID] = useState('');

  const [specifications, setSpecifications] = useState([{ title: "", desc: "" }]);
  const [images, setImages] = useState([]);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error when input changes
  };

  // Check localStorage for productId on component mount
  useEffect(() => {
    const storedProductId = localStorage.getItem("productId");
    if (storedProductId) {
      setIsEditing(true);  // If productId is found, we are in edit mode
      setProductId(storedProductId);  // Set the productId
    }
  }, [])

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const categoryName = categoryData[value]?.name;  // Get the category name from categoryData using the ID
    setCategoryID(value);
    setFormData({
      ...formData,
      category: categoryName,  // Set the category to the name of the category
      subCategory: ""          // Reset subcategory when category changes
    });
  };


  const handleSubCategoryChange = (e) => {
    const value = e.target.value;  // The selected subcategory ID

    // Find the selected subcategory name from the category data
    const selectedCategory = categoryData[categoryID]; // Use categoryID to find the selected category
    const selectedSubCategory = selectedCategory?.subcategories.find(
      (subCat) => subCat.id === value
    );

    // Update the subCategoryID and set the subCategory name in formData
    setSubCategoryID(value);
    setFormData({
      ...formData,
      subCategory: selectedSubCategory?.name || "Unknown Subcategory", // Set the subcategory name or fallback to "Unknown"
    });
  };


  const handleSpecificationsChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSpecs = [...specifications];
    updatedSpecs[index][name] = value;
    setSpecifications(updatedSpecs);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { title: "", desc: "" }]);
  };

  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 1) {
      alert('Please upload at least 1 images.');
      return;
    }

    const fileReaders = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders).then((base64Images) => setImages(base64Images));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required.";
    if (!formData.brand) newErrors.brand = "Brand is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.subCategory) newErrors.subCategory = "Subcategory is required.";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Price must be a valid number greater than zero.";
    if (
      !formData.cuttedPrice ||
      isNaN(formData.cuttedPrice) ||
      formData.cuttedPrice <= 0
    )
      newErrors.cuttedPrice =
        "Cutted Price must be a valid number greater than zero.";
    if (!formData.quantityAvailable)
      newErrors.quantityAvailable = "Quantity is required.";

    // Additional validations
    if (specifications.length === 0) {
      newErrors.specifications = "At least one specification is required";
    } else {
      specifications.forEach((spec, index) => {
        if (!spec.title) newErrors[`specTitle_${index}`] = "Specification title is required";
        if (!spec.desc) newErrors[`specDesc_${index}`] = "Specification description is required";
      });
    }
    // if (!formData.image) newErrors.image = "Image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  useEffect(() => {
    const fetchProductById = async () => {
      try {

        if (!productId) {
          console.log('productID is not found!');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product?id=${productId}`);

        if (!response.ok) {
          console.log('Product not found!');
          return;
        }

        const data = await response.json();
        const product = data.product;

        setCategoryID(product.categoryID._id); // Update categoryID
        setSubCategoryID(product.subCategoryID._id); // Update subCategoryID
        setSpecifications(product.specifications || [{ title: "", desc: "" }]);
        setImages(product.image);

        setFormData({
          title: product.title,
          brand: product.brand.name,
          category: categoryData[product.categoryID._id].name,  // Correctly set category name
          subCategory: categoryData[product.categoryID._id]?.subcategories.find(
            subCat => subCat.id === product.subCategoryID._id
          )?.name || "Unknown Subcategory",
          price: product.price,
          cuttedPrice: product.cuttedPrice,
          quantityAvailable: product.quantity,
        });

      } catch (error) {
        console.log('Error fetching product:', error);
      }
    };

    const productId = localStorage.getItem("productId");
    if (productId) {
      fetchProductById();
    } else {
      console.log('No productId found in localStorage');
    }
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate before sending data
    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      setIsSubmitting(false);
      return;
    }

    const dataToSend = {
      productId: isEditing ? productId : '',  // Only set productId if editing
      title: formData.title,
      brandName: formData.brand,
      categoryName: formData.category,
      subcategoryName: formData.subCategory,
      price: parseFloat(formData.price),
      cuttedPrice: parseFloat(formData.cuttedPrice),
      quantity: formData.quantityAvailable,
      specifications: specifications,
      images: images,
      rolename: user && user.role
    };
    // console.log('datatoSend :', dataToSend);


    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log('token not found!');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json", // Set header to send JSON
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error("Failed to submit the product.");

      const data = await response.json();

      resetForm();
      localStorage.removeItem("productId");
      toast.success(data.message, {
        autoClose: 3000,  // Toast stays for 3 seconds
      });


      // Wait for the toast to complete (matching the autoClose time) before redirecting
      setTimeout(() => {
        router.push('/services/collections');
      }, 3000);

      setErrors('');

    } catch (error) {
      console.error("Error submitting the form:", error.message);
      toast.error("Error submitting the form:", error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      brand: "",
      category: "",
      subCategory: "",
      price: "",
      cuttedPrice: "",
      image: "",
      quantityAvailable: ""
    })
  }


  return (
    <div className="flex justify-center text-xs mt-10">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-semibold">
            {isEditing ? 'Edit Product' : 'Add Product'}
          </h1>
          {/* Title and Brand in the same line */}
          <div className="flex space-x-6">
            <div className="w-1/2">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
              />
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                type="text"
                name="brand"
                placeholder="company name"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
              />
              {errors.brand && (
                <p className="text-red-500 text-xs">{errors.brand}</p>
              )}
            </div>
          </div>

          {/* Category and Subcategory in the same line */}
          <div className="flex space-x-6">
            {/* Category Dropdown */}
            <div className="w-1/2">
              <select
                value={categoryID}
                onChange={handleCategoryChange}
                className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
              >
                <option value="">Choose Category</option>
                {Object.keys(categoryData).map((categoryId) => (
                  <option key={categoryId} value={categoryId}>
                    {categoryData[categoryId].name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs">{errors.category}</p>
              )}
            </div>

            {/* Subcategory Dropdown */}
            <div className="w-1/2">
              <select
                value={subcategoryID}
                onChange={handleSubCategoryChange}
                className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                disabled={!categoryID} // Disable until a category is selected
              >
                <option value="">Select Subcategory</option>
                {categoryID &&
                  categoryData[categoryID]?.subcategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
              </select>
              {errors.subCategory && (
                <p className="text-red-500 text-xs">{errors.subCategory}</p>
              )}
            </div>
          </div>

          {/* Price and Cut Price in the same line */}
          <div className="flex space-x-6">
            <div className="w-1/2">
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
              />
              {errors.price && (
                <p className="text-red-500 text-xs">{errors.price}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                type="number"
                name="cuttedPrice"
                placeholder="Cutted Price"
                value={formData.cuttedPrice}
                onChange={handleChange}
                className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
              />
              {errors.cuttedPrice && (
                <p className="text-red-500 text-xs">{errors.cuttedPrice}</p>
              )}
            </div>
          </div>

          {/* Quantity Available */}
          <div className="flex space-x-6">
            <div className="w-full">
              <input
                type="text"
                name="quantityAvailable"
                placeholder="Quantity Available"
                value={formData.quantityAvailable}
                onChange={handleChange}
                className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
              />
              {errors.quantityAvailable && (
                <p className="text-red-500 text-xs">
                  {errors.quantityAvailable}
                </p>
              )}
            </div>
          </div>

          {/* //specification */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Highlights (format: title: desc, one per line)
            </label>
            {specifications && specifications.map((spec, index) => (
              <div key={index} className="flex items-center mb-2 gap-4">
                <input
                  type="text"
                  name="title"
                  value={spec.title}
                  onChange={(e) => handleSpecificationsChange(e, index)}
                  placeholder="title"
                  className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                />
                {errors[`specTitle_${index}`] && <p className="text-red-500">{errors[`specTitle_${index}`]}</p>}
                <input
                  type="text"
                  name="desc"
                  value={spec.desc}
                  onChange={(e) => handleSpecificationsChange(e, index)}
                  placeholder="description"
                  className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                />
                {errors[`specDesc_${index}`] && <p className="text-red-500">{errors[`specDesc_${index}`]}</p>}
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="ml-2 text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecification}
              className="text-blue-500"
            >
              Add highlights
            </button>
            {errors.specifications && <p className="text-red-500">{errors.specifications}</p>}
          </div>

          {/* Image Url */}
          <div className="flex space-x-6">
            <div className="w-full">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} />
              {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
              <p className="text-sm">

                {/* Display the count of selected images */}
                {images.length > 0
                  ? `${images.length} image${images.length > 1 ? 's' : ''} selected`
                  : 'No images selected yet'}
              </p>

              {/* Show image previews */}
              {images && images.length > 0 && (
                <div className="mt-2">
                  <h3 className="text-sm font-semibold">Selected Images:</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Array.from(images).map((file, index) => (
                      <div key={index} className="w-24 h-24 overflow-hidden relative">
                        <img
                          src={file} // Base64 image string
                          alt={`preview-${index}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 px-4 py-2 bg-green-400 text-white hover:bg-green-500"
          >
            {isEditing ? 'Update' : ' Submit'}
          </button>

        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default AddCollectionsServices;
