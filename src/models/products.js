import mongoose from "mongoose";
import slugify from "slugify"; // Import slugify

const { Schema } = mongoose;

// Map to store slug history (it would reset after a restart, but it's okay for now)
const slugMap = new Map();

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,  // Ensure the slug is unique
    },
    image: {
        type: [String], // Array of image URLs from Cloudinary
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    cuttedPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    specifications: [
        {
            title: {
                type: String,
                required: true,
            },
            desc: {
                type: String,
                required: true,
            },
        },
    ],
    isActive: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    categoryID: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategoryID: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
    sellerID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rolename: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Function to generate the next alphabetical prefix (e.g., ab, bc, cd, ...)
const getNextPrefix = (lastPrefix) => {
    if (!lastPrefix) return 'ab'; // Start with 'ab'

    let arr = lastPrefix.split('');
    let lastChar = arr.pop();

    if (lastChar === 'z') {
        arr[arr.length - 1] = String.fromCharCode(arr[arr.length - 1].charCodeAt(0) + 1);
        arr.push('a');
    } else {
        arr.push(String.fromCharCode(lastChar.charCodeAt(0) + 1));
    }

    return arr.join('');
};

// Function to generate a unique slug
async function generateUniqueSlug(title) {
    let formattedTitle = slugify(title, { lower: true, strict: true });

    if (slugMap.has(formattedTitle)) {
        let lastPrefix = slugMap.get(formattedTitle);
        let newPrefix = getNextPrefix(lastPrefix);
        slugMap.set(formattedTitle, newPrefix); // Update to the next prefix
        return `${newPrefix}-${formattedTitle}`;
    } else {
        slugMap.set(formattedTitle, 'ab'); // Start with 'ab' for the first time
        return `ab-${formattedTitle}`;
    }
}

// Before saving, create a slug based on the title
productSchema.pre('save', async function (next) {
    if (this.isNew && this.title) {
        this.slug = await generateUniqueSlug(this.title);
    }
    next();
});

// Add a hook to update the slug if the title changes (on updates)
productSchema.pre('findOneAndUpdate', async function (next) {
    const updatedTitle = this._update.title;
    if (updatedTitle) {
        this._update.slug = await generateUniqueSlug(updatedTitle);
    }
    next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;


