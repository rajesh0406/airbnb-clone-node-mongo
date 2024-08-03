import jwt from "jsonwebtoken";

// Middleware function to validate token
const authenticate = (req, res, next) => {
  // Get the token from cookies
  const { token } = req.cookies;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: Token not provided.",
    });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Forbidden: Invalid token.",
      });
    }

    // Attach user data to request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  });
};

export default authenticate;
