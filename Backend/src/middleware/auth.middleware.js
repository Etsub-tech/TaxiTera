import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization token missing." });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not found." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}


export function optionalProtect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // DEBUG: Success!
    console.log("DEBUG Middleware - User Verified:", decoded.username);

    req.user = decoded; 
    next();
    
  } catch (error) {
    // DEBUG: Token failed (Expired or Wrong Secret)
    console.log("DEBUG Middleware - Token Invalid:", error.message);
    next();
  }
}