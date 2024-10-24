const jwt = require('jsonwebtoken');

// Authentication middleware to verify JWT and set req.user
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;

// // Class to extract userId from JWT
// class AuthValidator {
//     constructor(idField = '_id') {
//         this.idField = idField;
//     }

//     verifyToken(req) {
//         const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
//         if (!token) {
//             return { status: 401, message: "Authorization token is required" };
//         }

//         // Verify and decode the token to extract the user ID (xId)
//         let decoded;
//         try {
//             decoded = jwt.verify(token, process.env.JWT_SECRET); // Secret key taken from environment variables
//         } catch (error) {
//             return { status: 401, message: "Invalid or expired token" };
//         }

//         const xId = decoded[this.idField];
//         if (!xId) {
//             return { status: 401, message: `Invalid token, ${this.idField} missing` };
//         }

//         return { status: 200, xId };
//     }
// }

// module.exports = AuthValidator