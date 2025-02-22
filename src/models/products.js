import mongoose from "mongoose";
import slugify from "slugify";

const { Schema } = mongoose;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    image: {
        type: [String],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    cuttedPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number, // Changed from String to Number for inventory management
        required: true,
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
        default: false,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
    },
    categoryID: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    },
    subCategoryID: {
        type: Schema.Types.ObjectId,
        ref: "Subcategory",
    },
    sellerID: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true, // Ensure sellerID is always present
    },
    rolename: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Slug generation logic (unchanged)
const slugMap = new Map();

const getNextPrefix = (lastPrefix) => {
    if (!lastPrefix) return "ab";
    let arr = lastPrefix.split("");
    let lastChar = arr.pop();
    if (lastChar === "z") {
        arr[arr.length - 1] = String.fromCharCode(arr[arr.length - 1].charCodeAt(0) + 1);
        arr.push("a");
    } else {
        arr.push(String.fromCharCode(lastChar.charCodeAt(0) + 1));
    }
    return arr.join("");
};

const generateUniqueSlug = async (title) => {
    let formattedTitle = slugify(title, { lower: true, strict: true });
    if (slugMap.has(formattedTitle)) {
        let lastPrefix = slugMap.get(formattedTitle);
        let newPrefix = getNextPrefix(lastPrefix);
        slugMap.set(formattedTitle, newPrefix);
        return `${newPrefix}-${formattedTitle}`;
    } else {
        slugMap.set(formattedTitle, "ab");
        return `ab-${formattedTitle}`;
    }
};

productSchema.pre("save", async function (next) {
    if (this.isNew && this.title) {
        this.slug = await generateUniqueSlug(this.title);
    }
    next();
});

productSchema.pre("findOneAndUpdate", async function (next) {
    const updatedTitle = this._update.title;
    if (updatedTitle) {
        this._update.slug = await generateUniqueSlug(updatedTitle);
    }
    next();
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);