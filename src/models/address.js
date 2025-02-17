import mongoose from "mongoose";

const { Schema } = mongoose;

const addressSchema = new Schema({
    address_line1: {
        type: String,
        required: true
    },
    address_line2: {
        type: String,
        default:null
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    Zip_Code: {
        type: Number,
        required: true
    },
    land_mark: {
        type: String,
        default: null
    },
    phone: {
        type: Number,
        required: true
    },
    alternative_phone: {
        type: Number,
        default:null
    },
}, { timestamps: true });

// Check if the model is already compiled
const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);

export default Address;