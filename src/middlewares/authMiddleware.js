import jwt from 'jsonwebtoken';

const authMiddleware = (request) => {
    const token = request.headers.get('Authorization')?.split(' ')[1];  // Extract token from 'Authorization' header

    if (!token) {
        throw new Error('Token is required');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify the token
        request.user = decoded; // Attach decoded user data to the request object
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export default authMiddleware;