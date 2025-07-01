// middleware/authMiddleware.js
import jwt from 'jsonwebtoken'
const secret = process.env.SECRET; // Use env var in production

const authMiddleware = (req, res, next) => {
    try {
  const token = req.cookies.token;
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

    const decoded = jwt.verify(token, secret);
    console.log("from middleware",decoded, secret)
    req.user = decoded; // Attach user payload to request object
    next(); // Proceed to next middleware or route
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware
