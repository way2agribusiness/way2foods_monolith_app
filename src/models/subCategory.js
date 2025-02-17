import mongoose from "mongoose";

const { Schema } = mongoose;

const subcategorySchema = new Schema({
    name: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const Subcategory = mongoose.models.Subcategory || mongoose.model('Subcategory', subcategorySchema);

export default Subcategory;