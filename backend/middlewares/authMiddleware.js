// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.model.js';

const secret = process.env.SECRET;

const authMiddleware = async (req, res, next) => {
  try {
    console.log("visited authmiddleware")
    let accessToken = req.cookies.emptoken;
    const refreshToken = req.cookies.emprefreshToken;

    // ✅ If access token is present and valid
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, secret);
        req.user = decoded;
        return next();
      } catch (err) {
        console.log("Access token expired or invalid");
      }
    }

    // ✅ Try to refresh token using refresh token
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, secret);
        const user = await Employee.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
          return res.status(401).json({ message: "Invalid refresh token" });
        }

        // ✅ Generate new access token
        const newAccessToken = jwt.sign(
          { id: user._id, email: user.email, name: user.firstName || user.name },
          secret,
          { expiresIn: "1h" }
        );

        // ✅ Set new access token in cookie
        res.cookie("token", newAccessToken, {
          httpOnly: true,
          secure: false, // true in production
          sameSite: "Lax",
          maxAge: 60 * 60 * 1000, // 1 hour
        });

        req.user = jwt.verify(newAccessToken, secret); // attach new decoded token
        return next();
      } catch (err) {
        console.log("Refresh token expired or invalid");
        return res.status(401).json({ message: "Unauthorized: Please login again" });
      }
    }

    // ❌ No valid tokens
    return res.status(401).json({ message: 'Unauthorized: Token missing or expired' });
  } catch (err) {
    console.log("Middleware error:", err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authMiddleware;
