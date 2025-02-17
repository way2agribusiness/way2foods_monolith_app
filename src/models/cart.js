import mongoose from "mongoose";

const { Schema } = mongoose;

const addtoCartSchema = new Schema({
    cartProducts: [
        {
            product_length: {
                type: Number,
                required: true
            },
            productID: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            }
        }
    ],
    buyerID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model('Cart', addtoCartSchema);

export default Cart;