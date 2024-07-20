import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const VerifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(403, "Forbidden"));

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
};
