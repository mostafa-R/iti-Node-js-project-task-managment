import { verifyToken } from "../utils/jwtHelpers.js";

export const authToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
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
