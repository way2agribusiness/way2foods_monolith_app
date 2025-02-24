router.post('/orders', auth, async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the incoming payload

        // Validate required fields
        const { address, paymentMethod, items, totalAmount } = req.body;
        if (!address || !paymentMethod || !items || !totalAmount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate ObjectId references
        if (!mongoose.Types.ObjectId.isValid(address)) {
            return res.status(400).json({ message: 'Invalid address ID' });
        }

        // Check if referenced documents exist
        const userExists = await User.findById(req.user._id);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressExists = await Address.findById(address);
        if (!addressExists) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Create and save order
        const order = new Order({
            user: req.user._id,
            address,
            paymentMethod,
            items,
            totalAmount,
            status: 'pending'
        });

        const savedOrder = await order.save();
        console.log('Order Saved:', savedOrder); // Log the saved order

        // Clear user's cart
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $set: { cartProducts: [] } },
            { new: true }
        );

        // Populate updated user data
        const user = await User.findById(req.user._id)
            .populate('addressID')
            .populate('cart');

        res.status(201).json({ user, orderId: savedOrder._id }); // Include orderId in the response

    } catch (error) {
        console.error('Error creating order:', error); // Log the error
        res.status(500).json({ message: error.message });
    }

    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
});