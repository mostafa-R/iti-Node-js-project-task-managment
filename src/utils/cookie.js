// set jwt in Cookies
import { verifyToken } from "./jwtHelpers.js";

export function setJwtCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 3600000,
  });
  console.log("JWT cookie set with token");
}

export function getJwtCookie(req) {
  try {
    const token = req.cookies.token;
    const decoded = verifyToken(token);
    req.user = decoded;
    return true;
  } catch (error) {
    console.error("Error retrieving JWT cookie:", error.message);
    return false;
  }
}

export function clearJwtCookie(res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  console.log("JWT cookie cleared");
}
