import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subCategoryID: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;