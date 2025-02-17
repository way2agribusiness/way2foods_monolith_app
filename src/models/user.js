import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: null
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: null
    },
    addressID: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Address'
        }
    ]
}, { timestamps: true });

// Check if the model is already compiled
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;