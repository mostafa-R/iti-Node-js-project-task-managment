import { verifyToken } from "../utils/jwtHelpers.js";

export const authToken = async (req, res, next) => {
  try {
    let token;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      return res.status(401).json({
        message: "Missing token in headers or cookies.",
      });
    }
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    const user = req.user;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

export const authorizeSelfOnly = () => {
  return (req, res, next) => {
    const user = req.user;
    const requestedUserId = req.params.id;

    if (user.role === "user" && String(user.id) !== String(requestedUserId)) {
      return res.status(403).json({
        message: "Access denied. You can only access your own data.",
      });
    }

    next();
  };
};
