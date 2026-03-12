import { RequestHandler } from "express";

/**
 * Middleware to protect routes that require authentication
 * Checks if user is authenticated via session
 * If not authenticated, returns 401 Unauthorized
 */
export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};
