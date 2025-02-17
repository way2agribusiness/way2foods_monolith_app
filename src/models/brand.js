import mongoose from "mongoose";

const { Schema } = mongoose;

const brandSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const Brand = mongoose.models.Brand || mongoose.model('Brand', brandSchema);

export default Brand;