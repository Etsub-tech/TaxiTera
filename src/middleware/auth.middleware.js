import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  try {
    // 1. Get authorization header
    const authHeader = req.headers.authorization;

    // 2. Check if header exists
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token missing."
      });
    }

    // 3. Header format: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    // 4. Check if token exists
    if (!token) {
      return res.status(401).json({
        message: "Token not found."
      });
    }

    // 5. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 6. Attach user info to request
    req.user = decoded;

    // 7. Allow request to continue
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
}
